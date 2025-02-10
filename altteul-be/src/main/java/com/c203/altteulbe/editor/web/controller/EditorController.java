package com.c203.altteulbe.editor.web.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.editor.service.EditorService;
import com.c203.altteulbe.editor.service.exception.EnemyTeamEditorIdNotFoundException;
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
	private final EditorService editorService;
	private final SimpMessagingTemplate messagingTemplate;

	// 커서 정보 등 전달
	@MessageMapping("/editor/{roomId}/awareness")
	public void handleAwareness(@DestinationVariable("roomId") Long roomId,
		@Payload AwarenessRequestDto awarenessRequestDto) {
		BattleType type = awarenessRequestDto.getType();

		// 개인전일때
		if (type == BattleType.S) {
			AwarenessResponseDto response = AwarenessResponseDto.builder()
				.roomId(roomId)
				.awareness(awarenessRequestDto.getAwareness())
				.build();

			messagingTemplate.convertAndSend("/sub/editor/" + type + "/" + roomId + "awareness/",
				WebSocketResponse.withData("AWARENESS", response));
			// 팀전일때
		} else {
			// 상대팀 에디터 아이디 얻기
			String enemyTeamEditorId = editorService.getEnemyTeamEditorId(roomId);
			if (enemyTeamEditorId == null) {
				throw new EnemyTeamEditorIdNotFoundException();
			}
			AwarenessResponseDto response = AwarenessResponseDto.builder()
				.roomId(roomId)
				.awareness(awarenessRequestDto.getAwareness())
				.build();

			// 정보를 나 and 상대팀에게 둘 다 보내기
			messagingTemplate.convertAndSend("/sub/editor/" + type + "/" + roomId + "awareness/",
				WebSocketResponse.withData("AWARENESS", response));
			messagingTemplate.convertAndSend("/sub/editor/" + type + "/" + enemyTeamEditorId + "awareness/",
				WebSocketResponse.withData("AWARENESS", response));
		}
		log.info("awareness 정보 전달 완료");
	}

	// editor 상태 정보 전달
	@MessageMapping("/editor/{roomId}/update")
	public void handleUpdate(@DestinationVariable("roomId") Long roomId,
		@Payload EditorRequestDto editorRequestDto) {
		BattleType type = editorRequestDto.getType();
		if (type == BattleType.S) {
			EditorResponseDto response = EditorResponseDto.builder()
				.roomId(roomId)
				.content(editorRequestDto.getContent())
				.build();
			messagingTemplate.convertAndSend("/sub/editor/" + type + "/" + roomId,
				WebSocketResponse.withData("UPDATE", response));
		} else {
			String enemyTeamEditorId = editorService.getEnemyTeamEditorId(roomId);
			if (enemyTeamEditorId == null) {
				throw new EnemyTeamEditorIdNotFoundException();
			}
			EditorResponseDto response = EditorResponseDto.builder()
				.roomId(roomId)
				.content(editorRequestDto.getContent())
				.build();
			messagingTemplate.convertAndSend("/sub/editor/" + type + "/" + roomId,
				WebSocketResponse.withData("UPDATE", response));
			messagingTemplate.convertAndSend("/sub/editor/" + type + "/" + enemyTeamEditorId,
				WebSocketResponse.withData("UPDATE", response));
		}
		log.info("editor 상태 업데이트 완료");
	}
}
