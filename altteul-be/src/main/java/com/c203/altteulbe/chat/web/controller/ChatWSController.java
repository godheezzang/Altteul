package com.c203.altteulbe.chat.web.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import com.c203.altteulbe.chat.service.ChatMessageService;
import com.c203.altteulbe.chat.web.dto.request.ChatMessageRequestDto;
import com.c203.altteulbe.chat.web.dto.response.ChatMessageReadResponseDto;
import com.c203.altteulbe.chat.web.dto.response.ChatMessageResponseDto;
import com.c203.altteulbe.websocket.dto.response.WebSocketResponse;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatWSController {
	private final SimpMessagingTemplate messagingTemplate;
	private final ChatMessageService chatMessageService;

	// 채팅방에 입장하면 메세지 읽음 처리
	@MessageMapping("/chat/room/{chatroomId}/enter")
	public void enterChatroom(@DestinationVariable(value = "chatroomId") Long chatroomId,
		@AuthenticationPrincipal Long userId) {
		messageRead(chatroomId, userId);
	}

	// 채팅방에서 대화 실시간 읽음 처리
	@MessageMapping("/chat/room/{chatroomId}/message")
	public void handleMessage(
		@DestinationVariable(value = "chatroomId") Long chatroomId,
		@Payload ChatMessageRequestDto requestDto,
		@AuthenticationPrincipal Long userId) {
		// 메세지 저장
		ChatMessageResponseDto savedMessage = chatMessageService.saveMessage(chatroomId, requestDto);

		messagingTemplate.convertAndSend(
			"/chat/room" + chatroomId,
			WebSocketResponse.withData("새 메시지", savedMessage)
		);

		messageRead(chatroomId, userId);

	}

	// 메세지 읽음 처리
	private void messageRead(Long chatroomId, Long userId) {
		ChatMessageReadResponseDto response = chatMessageService.markMessageAsRead(chatroomId, userId);
		if (response != null) {
			messagingTemplate.convertAndSend("/chat/room/" + chatroomId + "/read",
				WebSocketResponse.withData("읽은 채팅 메세지", response));
		}
	}
}
