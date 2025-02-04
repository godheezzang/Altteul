package com.c203.altteulbe.chat.persistent.repository;

import java.util.List;
import java.util.Optional;

import com.c203.altteulbe.chat.persistent.entity.ChatMessage;
import com.c203.altteulbe.chat.web.dto.response.ChatroomResponseDto;

public interface ChatroomCustomRepository {
	List<ChatroomResponseDto> findAllChatroomsByUserId(Long userId);
	Optional<ChatroomResponseDto> findChatroomById(Long chatroomId, Long userId);

}
