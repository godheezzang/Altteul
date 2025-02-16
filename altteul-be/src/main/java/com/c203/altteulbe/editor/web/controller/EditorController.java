package com.c203.altteulbe.editor.web.controller;

import java.util.Objects;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.editor.web.dto.request.AwarenessRequestDto;
import com.c203.altteulbe.editor.web.dto.request.EditorRequestDto;
import com.c203.altteulbe.editor.web.dto.response.AwarenessResponseDto;
import com.c203.altteulbe.editor.web.dto.response.EditorResponseDto;
import com.c203.altteulbe.websocket.dto.response.WebSocketResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class EditorController {
	private final SimpMessagingTemplate messagingTemplate;
	private final RedisTemplate<String, String> redisTemplate;

	// 커서 정보 등 전달
	@MessageMapping("/editor/{roomId}/awareness")
	public void handleAwareness(@DestinationVariable("roomId") Long roomId,
		@Payload AwarenessRequestDto awarenessRequestDto) {
		AwarenessResponseDto response = AwarenessResponseDto.builder()
			.roomId(roomId)
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
		@Payload EditorRequestDto editorRequestDto) {
		EditorResponseDto response = EditorResponseDto.builder()
			.roomId(roomId)
			.content(editorRequestDto.getContent())
			.build();

		messagingTemplate.convertAndSend("/sub/editor/" + roomId,
			WebSocketResponse.withData("UPDATE", response));
		messagingTemplate.convertAndSend("/sub/editor/" + getOpposingRoomId(roomId),
			WebSocketResponse.withData("UPDATE", response));
		log.info("editor 상태 업데이트 완료");
	}

	// 상대 팀 id 찾기
	private String getOpposingRoomId(Long roomId) {
		String roomUUID = redisTemplate.opsForValue().get(RedisKeys.getRoomRedisId(roomId));
		String matchId = redisTemplate.opsForValue().get(RedisKeys.TeamMatchId(Long.parseLong(
			Objects.requireNonNull(roomUUID))));
		String opposingRoomUUID = matchId.replace(roomUUID, "").replace("-", "");
		return redisTemplate.opsForValue().get(RedisKeys.getRoomDbId(Long.parseLong(opposingRoomUUID)));
	}
}
