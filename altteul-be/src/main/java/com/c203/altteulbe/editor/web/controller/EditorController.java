package com.c203.altteulbe.editor.web.controller;

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
	@MessageMapping("/editor/{roomUUID}/awareness")
	public void handleAwareness(@DestinationVariable("roomUUID") Long roomUUID,
		@Payload AwarenessRequestDto awarenessRequestDto) {
		AwarenessResponseDto response = AwarenessResponseDto.builder()
			.roomUUID(roomUUID)
			.awareness(awarenessRequestDto.getAwareness())
			.build();

		// 상대 팀 id 찾기
		String matchId = redisTemplate.opsForValue().get(RedisKeys.TeamMatchId(roomUUID));
		String opposingRoomUUID = matchId.replace(roomUUID.toString(), "").replace("-", "");

		// 정보를 나 and 상대팀에게 둘 다 보내기
		messagingTemplate.convertAndSend("/sub/editor/" + roomUUID + "awareness",
			WebSocketResponse.withData("AWARENESS", response));
		messagingTemplate.convertAndSend("/sub/editor/" + opposingRoomUUID + "awareness",
			WebSocketResponse.withData("AWARENESS", response));

		log.info("awareness 정보 전달 완료");
	}

	// editor 상태 정보 전달
	@MessageMapping("/editor/{roomUUID}/update")
	public void handleUpdate(@DestinationVariable("roomUUID") Long roomUUID,
		@Payload EditorRequestDto editorRequestDto) {
		EditorResponseDto response = EditorResponseDto.builder()
			.roomUUID(roomUUID)
			.content(editorRequestDto.getContent())
			.build();

		// 상대 팀 id 찾기
		String matchId = redisTemplate.opsForValue().get(RedisKeys.TeamMatchId(roomUUID));
		String opposingRoomUUID = matchId.replace(roomUUID.toString(), "").replace("-", "");

		messagingTemplate.convertAndSend("/sub/editor/" + roomUUID,
			WebSocketResponse.withData("UPDATE", response));
		messagingTemplate.convertAndSend("/sub/editor/" + opposingRoomUUID,
			WebSocketResponse.withData("UPDATE", response));
		log.info("editor 상태 업데이트 완료");
	}
}
