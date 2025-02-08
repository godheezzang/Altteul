package com.c203.altteulbe.chat.persistent.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import com.c203.altteulbe.chat.persistent.entity.ChatMessage;
import com.c203.altteulbe.chat.persistent.entity.Chatroom;
import com.c203.altteulbe.chat.persistent.entity.QChatMessage;
import com.c203.altteulbe.chat.persistent.entity.QChatroom;
import com.c203.altteulbe.chat.persistent.entity.QUserChatRoom;
import com.c203.altteulbe.chat.web.dto.response.ChatMessageResponseDto;
import com.c203.altteulbe.chat.web.dto.response.ChatroomDetailResponseDto;
import com.c203.altteulbe.chat.web.dto.response.ChatroomListResponseDto;
import com.c203.altteulbe.friend.service.UserStatusService;
import com.c203.altteulbe.user.persistent.entity.QUser;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class ChatroomCustomRepositoryImpl extends QuerydslRepositorySupport implements ChatroomCustomRepository {
	private final JPAQueryFactory queryFactory;
	private final UserStatusService userStatusService;

	public ChatroomCustomRepositoryImpl(JPAQueryFactory queryFactory, UserStatusService userStatusService) {
		super(Chatroom.class);
		this.queryFactory = queryFactory;
		this.userStatusService = userStatusService;
	}

	// 유저의 모든 채팅방 조회
	@Override
	public List<ChatroomListResponseDto> findAllChatroomsByUserId(Long userId) {
		QChatMessage qChatMessage = QChatMessage.chatMessage;
		QChatroom qChatroom = QChatroom.chatroom;
		QUserChatRoom qUserChatRoom = QUserChatRoom.userChatRoom;
		QUser qUser = QUser.user;

		List<ChatroomListResponseDto> chatrooms = queryFactory
			.select(Projections.constructor(ChatroomListResponseDto.class,
				qUser.userId,
				qUser.nickname,
				qUser.profileImg,
				Expressions.constant(false), // 유저의 온라인 상태
				qChatMessage.messageContent,
				Expressions.cases()          // 내가 읽었는지 확인하는 로직
					.when(
						JPAExpressions
							.selectOne()
							.from(qChatMessage)
							.where(qChatMessage.chatroom.eq(qChatroom)
								.and(qChatMessage.sender.userId.ne(userId)) // 상대방이 보낸 메시지만 확인
								.and(qChatMessage.checked.isFalse())) // 읽지 않은 메시지가 있는지 확인
							.exists()
					)
					.then(false)
					.otherwise(true),
				Expressions.cases() // 메세지 보낸 시간
					.when(qChatMessage.createdAt.isNotNull())
					.then(qChatMessage.createdAt)
					.otherwise(qChatroom.createdAt)))
			.from(qChatroom)
			.join(qUserChatRoom).on(qUserChatRoom.chatroom.eq(qChatroom))
			.join(qUser).on(qUserChatRoom.user.eq(qUser))
			.leftJoin(qChatMessage).on(
				qChatMessage.chatroom.eq(qChatroom)
					.and(qChatMessage.chatMessageId.eq(
						JPAExpressions
							.select(qChatMessage.chatMessageId.max()) // 제일 최신 메세지 선택
							.from(qChatMessage)
							.where(qChatMessage.chatroom.eq(qChatroom))
					))
			)
			.where(qUserChatRoom.user.userId.ne(userId)) // 상대방이 보낸 메세지(자신 X)
			.orderBy( // 최신 순으로 정렬
				Expressions.cases()
					.when(qChatMessage.createdAt.isNotNull())
					.then(qChatMessage.createdAt)
					.otherwise(qChatroom.createdAt).desc()
			)
			.fetch();
		// 채팅방의 친구 id 리스트
		List<Long> userIds = chatrooms.stream()
			.map(ChatroomListResponseDto::getFriendId)
			.toList();
		Map<Long, Boolean> onlineStatus = userStatusService.getBulkOnlineStatus(userIds); // 친구들의 온라인 상태 파악
		return chatrooms.stream()
			.map(chatroom -> ChatroomListResponseDto.builder()
				.friendId(chatroom.getFriendId())
				.nickname(chatroom.getNickname())
				.profileImg(chatroom.getProfileImg())
				.isOnline(onlineStatus.getOrDefault(chatroom.getFriendId(), false))
				.recentMessage(chatroom.getRecentMessage())
				.isMessageRead(chatroom.getIsMessageRead())
				.createdAt(chatroom.getCreatedAt())
				.build())
			.collect(Collectors.toList());
	}

	// 단일 채팅방 상세 정보
	@Override
	public Optional<ChatroomDetailResponseDto> findChatroomById(Long chatroomId, Long userId) {
		QChatMessage qChatMessage = QChatMessage.chatMessage;
		QChatroom qChatroom = QChatroom.chatroom;
		QUserChatRoom qUserChatRoom = QUserChatRoom.userChatRoom;
		QUser qUser = QUser.user;

		// 채팅방 기본 정보 조회
		Tuple chatroomInfo = queryFactory
			.select(
				qUser.userId,
				qUser.nickname,
				qUser.profileImg,
				qChatroom.createdAt
			)
			.from(qChatroom)
			.join(qUserChatRoom).on(qUserChatRoom.chatroom.eq(qChatroom))
			.join(qUser).on(qUserChatRoom.user.eq(qUser))
			.where(
				qChatroom.chatroomId.eq(chatroomId)
					.and(qUserChatRoom.user.userId.ne(userId))
			)
			.fetchOne();

		if (chatroomInfo == null) {
			return Optional.empty();
		}

		// 최근 60개 메시지 조회
		List<ChatMessage> recentMessages = queryFactory
			.selectFrom(qChatMessage)
			.join(qChatMessage.sender).fetchJoin()  // N+1 문제 방지
			.where(qChatMessage.chatroom.chatroomId.eq(chatroomId))
			.orderBy(qChatMessage.createdAt.desc())
			.limit(60)
			.fetch();

		// ChatMessageResponseDto로 변환
		List<ChatMessageResponseDto> messagesDtos = recentMessages.stream()
			.map(ChatMessageResponseDto::from)
			.toList();

		Boolean isOnline = userStatusService.isUserOnline(chatroomInfo.get(qUser.userId));

		return Optional.of(ChatroomDetailResponseDto.builder()
			.friendId(chatroomInfo.get(qUser.userId))
			.nickname(chatroomInfo.get(qUser.nickname))
			.profileImg(chatroomInfo.get(qUser.profileImg))
			.isOnline(isOnline)
			.messages(messagesDtos)
			.createdAt(chatroomInfo.get(qChatroom.createdAt))
			.build());
	}

	@Override
	public Optional<ChatroomDetailResponseDto> findExistingChatroom(Long userId, Long friendId) {
		QChatroom qChatroom = QChatroom.chatroom;
		QUserChatRoom qUserChatRoom = QUserChatRoom.userChatRoom;

		Long chatroomId = queryFactory
			.select(qChatroom.chatroomId)
			.from(qChatroom)
			.join(qUserChatRoom).on(qUserChatRoom.chatroom.eq(qChatroom))
			.where(qUserChatRoom.user.userId.in(userId, friendId))
			.groupBy(qChatroom.chatroomId)
			.having(qUserChatRoom.count().eq(2L))
			.fetchFirst();

		return findChatroomById(chatroomId, userId);
	}


}
