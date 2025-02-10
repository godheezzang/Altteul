package com.c203.altteulbe.editor.web.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.editor.service.EditorService;
import com.c203.altteulbe.editor.web.dto.request.AwarenessRequestDto;
import com.c203.altteulbe.editor.web.dto.request.EditorRequestDto;
import com.c203.altteulbe.editor.web.dto.response.AwarenessResponseDto;
import com.c203.altteulbe.editor.web.dto.response.EditorResponseDto;
import com.c203.altteulbe.room.service.TeamRoomService;
import com.c203.altteulbe.websocket.dto.response.WebSocketResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class EditorController {
	private final EditorService editorService;
	private final SimpMessagingTemplate messagingTemplate;
	private final TeamRoomService teamRoomService;

	// editor 참가(접속)
	@MessageMapping("/editor/{editorId}/join")
	public void handleJoin(@DestinationVariable("editorId") String editorId,
		SimpMessageHeaderAccessor accessor) {
		long id = Long.parseLong(accessor.getSessionAttributes().get("userId").toString());
		String[] parts = editorId.split(":");
		BattleType type = BattleType.valueOf(parts[0].toUpperCase());
		Long teamRoomId = Long.parseLong(parts[1]);

		if (type == BattleType.S) {
			EditorResponseDto editor = editorService.getEditor(editorId);
			// 접속한 사용자에게 현재 문서 상태 전송
			messagingTemplate.convertAndSend("/sub/editor/" + editorId + "init",
				WebSocketResponse.withData("INIT", editor));
		} else {
			String enemyTeamEditorId = editorService.getEnemyTeamEditorId(teamRoomId);

			EditorResponseDto response = editorService.getEditor(editorId);

			messagingTemplate.convertAndSend("/sub/editor/" + editorId + "init",
				WebSocketResponse.withData("INIT", response));
			messagingTemplate.convertAndSend("/sub/editor/" + enemyTeamEditorId + "init",
				WebSocketResponse.withData("INIT", response));
		}
		log.info("editor {} 접속 - 초기 세팅 완료: ", editorId);
	}

	// 커서 정보 등 전달
	@MessageMapping("/editor/{editorId}/awareness")
	public void handleAwareness(@DestinationVariable("editorId") String editorId,
		@Payload AwarenessRequestDto awarenessRequestDto) {
		String[] parts = editorId.split(":");
		BattleType type = BattleType.valueOf(parts[0].toUpperCase());
		Long teamRoomId = Long.parseLong(parts[1]);

		if (type == BattleType.S) {
			AwarenessResponseDto response = AwarenessResponseDto.builder()
				.editorId(editorId)
				.awareness(awarenessRequestDto.getAwareness())
				.build();

			messagingTemplate.convertAndSend("/sub/editor/" + editorId + "awareness",
				WebSocketResponse.withData("AWARENESS", response));
		} else {
			String enemyTeamEditorId = editorService.getEnemyTeamEditorId(teamRoomId);

			AwarenessResponseDto response = AwarenessResponseDto.builder()
				.editorId(editorId)
				.awareness(awarenessRequestDto.getAwareness())
				.build();

			messagingTemplate.convertAndSend("/sub/editor/" + editorId + "awareness",
				WebSocketResponse.withData("AWARENESS", response));
			messagingTemplate.convertAndSend("/sub/editor/" + enemyTeamEditorId + "awareness",
				WebSocketResponse.withData("AWARENESS", response));
		}
		log.info("awareness 정보 전달 완료");
	}

	// editor 상태 정보 전달
	@MessageMapping("/editor/{editorId}/update")
	public void handleUpdate(@DestinationVariable("editorId") String editorId,
		@Payload EditorRequestDto editorRequestDto) {
		String[] parts = editorId.split(":");
		BattleType type = BattleType.valueOf(parts[0].toUpperCase());
		Long teamRoomId = Long.parseLong(parts[1]);

		// 개인전
		if (type == BattleType.S) {
			EditorResponseDto response = EditorResponseDto.builder()
				.editorId(editorId)
				.content(editorRequestDto.getContent())
				.build();

			messagingTemplate.convertAndSend("/sub/editor/" + editorId,
				WebSocketResponse.withData("UPDATE", response));
		}
		// 팀전
		else {
			String enemyTeamEditorId = editorService.getEnemyTeamEditorId(teamRoomId);

			EditorResponseDto response = EditorResponseDto.builder()
				.editorId(editorId)
				.content(editorRequestDto.getContent())
				.build();

			// 자신의 토픽으로만 전송
			messagingTemplate.convertAndSend("/sub/editor/" + editorId,
				WebSocketResponse.withData("UPDATE", response));
			messagingTemplate.convertAndSend("/sub/editor/" + enemyTeamEditorId,
				WebSocketResponse.withData("UPDATE", response));
		}
		log.info("editor 상태 업데이트 완료");
	}

	// editor 저장
	@MessageMapping("/editor/{editorId}/save")
	public void handleSave(@DestinationVariable("editorId") String editorId,
		@Payload byte[] state) {
		editorService.saveState(editorId, state);
		log.info("editor 상태 저장 완료");
	}

}
