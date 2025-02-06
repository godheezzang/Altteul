package com.c203.altteulbe.chat.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.chat.persistent.entity.Chatroom;
import com.c203.altteulbe.chat.persistent.entity.UserChatRoom;
import com.c203.altteulbe.chat.persistent.repository.ChatroomRepository;
import com.c203.altteulbe.chat.persistent.repository.UserChatRoomRepository;
import com.c203.altteulbe.chat.service.exception.NotFoundChatroomException;
import com.c203.altteulbe.chat.web.dto.request.ChatMessageRequestDto;
import com.c203.altteulbe.chat.web.dto.response.ChatMessageResponseDto;
import com.c203.altteulbe.chat.web.dto.response.ChatroomDetailResponseDto;
import com.c203.altteulbe.chat.web.dto.response.ChatroomListResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatroomService {
	private final ChatroomRepository chatroomRepository;
	private final UserJPARepository userJPARepository;
	private final UserChatRoomRepository userChatRoomRepository;

	public List<ChatroomListResponseDto> getAllChatrooms(Long userId) {
		return chatroomRepository.findAllChatroomsByUserId(userId);
	}

	public ChatroomDetailResponseDto getChatroom(Long chatroomId, Long userId) {
		return chatroomRepository.findChatroomById(chatroomId, userId)
			.orElseThrow(NotFoundChatroomException::new);
	}

	// 채팅방 생성 혹은 조회
	@Transactional
	public ChatroomDetailResponseDto createOrGetChatroom(Long userId, Long friendId) {
		// 이미 존재하는 1:1 채팅방 확인
		Optional<ChatroomDetailResponseDto> existingChatroom =
			chatroomRepository.findExistingChatroom(userId, friendId);

		if (existingChatroom.isPresent()) {
			return existingChatroom.get();
		}

		// 유저 찾기
		User user = userJPARepository.findById(userId)
			.orElseThrow(NotFoundUserException::new);
		User friend = userJPARepository.findById(friendId)
			.orElseThrow(NotFoundUserException::new);

		// 새 채팅방 생성
		Chatroom newChatroom = chatroomRepository.save(new Chatroom());

		// 사용자와 친구를 채팅방에 추가
		createUserChatRoom(newChatroom, user);
		createUserChatRoom(newChatroom, friend);

		return getChatroom(newChatroom.getChatroomId(), userId);
	}

	@Transactional
	public void createUserChatRoom(Chatroom chatroom, User user) {
		UserChatRoom userChatRoom = UserChatRoom.builder()
			.chatroom(chatroom)
			.user(user)
			.build();
		userChatRoomRepository.save(userChatRoom);
	}
}
