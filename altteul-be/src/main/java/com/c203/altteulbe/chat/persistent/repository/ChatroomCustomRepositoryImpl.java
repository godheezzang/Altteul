package com.c203.altteulbe.chat.persistent.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import com.c203.altteulbe.chat.persistent.entity.Chatroom;
import com.c203.altteulbe.chat.persistent.entity.QChatMessage;
import com.c203.altteulbe.chat.persistent.entity.QChatroom;
import com.c203.altteulbe.chat.persistent.entity.QUserChatRoom;
import com.c203.altteulbe.chat.web.dto.response.ChatroomResponseDto;
import com.c203.altteulbe.friend.service.UserStatusService;
import com.c203.altteulbe.user.persistent.entity.QUser;
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

	@Override
	public List<ChatroomResponseDto> findAllChatroomsByUserId(Long userId) {
		QChatMessage qChatMessage = QChatMessage.chatMessage;
		QChatroom qChatroom = QChatroom.chatroom;
		QUserChatRoom qUserChatRoom = QUserChatRoom.userChatRoom;
		QUser qUser = QUser.user;

		List<ChatroomResponseDto> chatrooms = queryFactory
			.select(Projections.constructor(ChatroomResponseDto.class,
				qUser.userId,
				qUser.nickname,
				qUser.profileImg,
				Expressions.constant(false),
				qChatMessage.messageContent,
				Expressions.cases()          // 내가 읽었는지 확인하는 로직 추가
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
				Expressions.cases()
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
							.select(qChatMessage.chatMessageId.max())
							.from(qChatMessage)
							.where(qChatMessage.chatroom.eq(qChatroom))
					))
			)
			.where(qUserChatRoom.user.userId.ne(userId))
			.orderBy(
				Expressions.cases()
					.when(qChatMessage.createdAt.isNotNull())
					.then(qChatMessage.createdAt)
					.otherwise(qChatroom.createdAt).desc()
			)
			.fetch();
		List<Long> userIds = chatrooms.stream()
			.map(ChatroomResponseDto::getFriendId)
			.toList();
		Map<Long, Boolean> onlineStatus = userStatusService.getBulkOnlineStatus(userIds);
		return chatrooms.stream()
			.map(chatroom -> ChatroomResponseDto.builder()
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

	@Override
	public Optional<ChatroomResponseDto> findChatroomById(Long chatroomId, Long userId) {
		QChatMessage qChatMessage = QChatMessage.chatMessage;
		QChatroom qChatroom = QChatroom.chatroom;
		QUserChatRoom qUserChatRoom = QUserChatRoom.userChatRoom;
		QUser qUser = QUser.user;

		ChatroomResponseDto chatroom = queryFactory
			.select(Projections.constructor(ChatroomResponseDto.class,
				qUser.userId,
				qUser.nickname,
				qUser.profileImg,
				Expressions.constant(false),
				qChatMessage.messageContent,
				Expressions.cases()          // 내가 읽었는지 확인하는 로직 추가
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
				Expressions.cases()
					.when(qChatMessage.createdAt.isNotNull())
					.then(qChatMessage.createdAt)
					.otherwise(qChatroom.createdAt)))
			.from(qChatroom)
			.join(qUserChatRoom).on(qUserChatRoom.chatroom.eq(qChatroom))
			.join(qUser).on(qUserChatRoom.user.eq(qUser))
			.leftJoin(qChatMessage).on(qChatMessage.chatroom.eq(qChatroom))
			.where(
				qChatroom.chatroomId.eq(chatroomId)
					.and(qUserChatRoom.user.userId.ne(userId))
			)
			.orderBy(qChatMessage.createdAt.desc())
			.limit(1)
			.fetchOne();
		if (chatroom == null) {
			return Optional.empty();
		}
		Boolean isOnline = userStatusService.isUserOnline(chatroom.getFriendId());
		ChatroomResponseDto chatroomDto = ChatroomResponseDto.builder()
			.friendId(chatroom.getFriendId())
			.nickname(chatroom.getNickname())
			.profileImg(chatroom.getProfileImg())
			.isOnline(isOnline)
			.recentMessage(chatroom.getRecentMessage())
			.isMessageRead(chatroom.getIsMessageRead())
			.createdAt(chatroom.getCreatedAt())
			.build();
		return Optional.of(chatroomDto);

	}


}
