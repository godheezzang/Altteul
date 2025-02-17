package com.c203.altteulbe.editor.web.controller;

import java.util.Map;
import java.util.Objects;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.editor.web.dto.request.AwarenessRequestDto;
import com.c203.altteulbe.editor.web.dto.request.EditorRequestDto;
import com.c203.altteulbe.editor.web.dto.response.AwarenessResponseDto;
import com.c203.altteulbe.editor.web.dto.response.EditorResponseDto;
import com.c203.altteulbe.editor.web.dto.response.EditorStateResponseDto;
import com.c203.altteulbe.websocket.dto.response.WebSocketResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class EditorController {
	private final SimpMessagingTemplate messagingTemplate;
	private final RedisTemplate<String, String> redisTemplate;
	private static final ObjectMapper objectMapper = new ObjectMapper();

	// 커서 정보 등 전달
	@MessageMapping("/editor/{roomId}/awareness")
	public void handleAwareness(@DestinationVariable("roomId") Long roomId,
		@Payload AwarenessRequestDto awarenessRequestDto,
		SimpMessageHeaderAccessor headerAccessor) {

		String userId = headerAccessor.getSessionAttributes().get("userId").toString();
		String awarenessKey = RedisKeys.getEditorAwareness(roomId);
		redisTemplate.opsForValue().set(awarenessKey,
			objectToString(awarenessRequestDto.getAwareness()));

		AwarenessResponseDto response = AwarenessResponseDto.builder()
			.roomId(roomId)
			.userId(Long.parseLong(userId))
			.awareness(awarenessRequestDto.getAwareness())
			.build();

		// 정보를 나 and 상대팀에게 둘 다 보내기
		messagingTemplate.convertAndSend("/sub/editor/" + roomId + "awareness",
			WebSocketResponse.withData("AWARENESS", response));
		messagingTemplate.convertAndSend("/sub/editor/" + getOpposingRoomId(roomId) + "awareness",
			WebSocketResponse.withData("AWARENESS", response));

		log.info("awareness 정보 전달 완료");
	}

	// editor 상태 정보 전달
	@MessageMapping("/editor/{roomId}/update")
	public void handleUpdate(@DestinationVariable("roomId") Long roomId,
		@Payload EditorRequestDto editorRequestDto,
		SimpMessageHeaderAccessor headerAccessor) {

		String userId = headerAccessor.getSessionAttributes().get("userId").toString();
		String editorKey = RedisKeys.getEditorContent(roomId);
		redisTemplate.opsForValue().set(editorKey, editorRequestDto.getContent());

		EditorResponseDto response = EditorResponseDto.builder()
			.roomId(roomId)
			.userId(Long.parseLong(userId))
			.content(editorRequestDto.getContent())
			.build();

		messagingTemplate.convertAndSend("/sub/editor/" + roomId,
			WebSocketResponse.withData("UPDATE", response));
		messagingTemplate.convertAndSend("/sub/editor/" + getOpposingRoomId(roomId),
			WebSocketResponse.withData("UPDATE", response));
		log.info("editor 상태 업데이트 완료");
	}

	// 재접속시 최신 상태 복구
	@MessageMapping("/editor/{roomId}/get-state")
	public void handleGetState(@DestinationVariable("roomId") Long roomId,
		SimpMessageHeaderAccessor headerAccessor) {
		String userId = headerAccessor.getSessionAttributes().get("userId").toString();
		String editorKey = RedisKeys.getEditorContent(roomId);
		String awarenessKey = RedisKeys.getEditorAwareness(roomId);

		String content = redisTemplate.opsForValue().get(editorKey);
		String awareness = redisTemplate.opsForValue().get(awarenessKey);

		if (content != null || awareness != null) {
			EditorStateResponseDto response = EditorStateResponseDto.builder()
				.content(content)
				.userId(Long.parseLong(userId))
				.awareness(stringToObject(awareness, Map.class))
				.build();

			messagingTemplate.convertAndSend(
				"/sub/editor/" + roomId + "/state/" + userId,
				WebSocketResponse.withData("STATE", response));
		}
	}

	// 상대 팀 id 찾기
	private String getOpposingRoomId(Long roomId) {
		String roomUUID = redisTemplate.opsForValue().get(RedisKeys.getRoomRedisId(roomId));
		String matchId = redisTemplate.opsForValue().get(RedisKeys.TeamMatchId(Long.parseLong(
			Objects.requireNonNull(roomUUID))));
		String opposingRoomUUID = matchId.replace(roomUUID, "").replace("-", "");
		return redisTemplate.opsForValue().get(RedisKeys.getRoomDbId(Long.parseLong(opposingRoomUUID)));
	}

	public static String objectToString(Object obj) {
		try {
			return objectMapper.writeValueAsString(obj);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Failed to convert object to string", e);
		}
	}

	public static <T> T stringToObject(String str, Class<T> valueType) {
		try {
			return objectMapper.readValue(str, valueType);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Failed to convert string to object", e);
		}
	}
}
