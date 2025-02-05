package com.c203.altteulbe.room.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.websocket.dto.response.WebSocketResponse;
import com.c203.altteulbe.websocket.exception.WebSocketMessageException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomWebSocketService {
	private final SimpMessagingTemplate messagingTemplate;

	public <T> void sendWebSocketMessage(String roomId, String eventType, T responseDto, BattleType type) {
		String destination = getWebSocketDestination(roomId, type);
		sendMessage(destination, eventType, responseDto);
	}

	public void sendWebSocketMessage(String roomId, String eventType, String message, BattleType type) {
		String destination = getWebSocketDestination(roomId, type);
		sendMessage(destination, eventType, message);
	}

	private <T> void sendMessage(String destination, String eventType, T payload) {
		try {
			messagingTemplate.convertAndSend(destination, WebSocketResponse.withData(eventType, payload));
		} catch (Exception e) {
			log.error("WebSocket 메시지 전송 실패 (eventType: {}, destination: {}): {}", eventType, destination, e.getMessage());
			throw new WebSocketMessageException();
		}
	}

	private String getWebSocketDestination(String roomId, BattleType type) {
		return (type == BattleType.S) ? "/sub/single/room/" + roomId : "/sub/team/room/" + roomId;
	}
}

