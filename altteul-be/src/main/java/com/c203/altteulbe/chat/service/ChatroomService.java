package com.c203.altteulbe.chat.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.c203.altteulbe.chat.persistent.repository.ChatroomRepository;
import com.c203.altteulbe.chat.service.exception.NotFoundChatroomException;
import com.c203.altteulbe.chat.web.dto.response.ChatroomResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatroomService {
	private final ChatroomRepository chatroomRepository;

	public List<ChatroomResponseDto> getAllChatrooms(Long userId) {
		return chatroomRepository.findAllChatroomsByUserId(userId);
	}

	public ChatroomResponseDto getChatroom(Long chatroomId, Long userId) {
		return chatroomRepository.findChatroomById(chatroomId, userId)
			.orElseThrow(NotFoundChatroomException::new);
	}

}
