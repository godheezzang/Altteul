package com.c203.altteulbe.chat.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.chat.persistent.repository.ChatroomRepository;
import com.c203.altteulbe.chat.web.dto.response.ChatroomResponseDto;
import com.c203.altteulbe.common.exception.BusinessException;

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
			.orElseThrow(() -> new BusinessException("존재하지 않는 채팅방입니다.", HttpStatus.NOT_FOUND));
	}

}
