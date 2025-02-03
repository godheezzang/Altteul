package com.c203.altteulbe.room.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.c203.altteulbe.websocket.dto.response.WebSocketResponse;
import com.c203.altteulbe.websocket.exception.WebSocketMessageException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomWebSocketService {
	private final SimpMessagingTemplate messagingTemplate;

	// WebSocket 메시지 브로드캐스트
	public <T> void sendWebSocketMessage(String roomId, String eventType, T responseDto) {
		try {
			messagingTemplate.convertAndSend("/sub/single/room/" + roomId,
				WebSocketResponse.withData(eventType, responseDto));
		} catch (Exception e) {
			log.error("WebSocket 메시지 전송 실패 (eventType: {}, roomId: {}): {}", eventType, roomId, e.getMessage());
			throw new WebSocketMessageException();
		}
	}

	public void sendWebSocketMessage(String roomId, String eventType, String message) {
		try {
			messagingTemplate.convertAndSend("/sub/single/room/" + roomId,
				WebSocketResponse.withMessage(eventType, message));
		} catch (Exception e) {
			log.error("WebSocket 메시지 전송 실패 (eventType: {}, roomId: {}): {}", eventType, roomId, e.getMessage());
			throw new WebSocketMessageException();
		}
	}
}
