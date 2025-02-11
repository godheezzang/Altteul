package com.c203.altteulbe.openvidu.web.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.c203.altteulbe.openvidu.service.VoiceChatService;
import com.c203.altteulbe.openvidu.web.dto.reqeust.VoiceChatRequestDto;
import com.c203.altteulbe.openvidu.web.dto.reqeust.VoiceEventRequestDto;
import com.c203.altteulbe.openvidu.web.dto.response.VoiceEventResponseDto;
import com.c203.altteulbe.websocket.dto.response.WebSocketResponse;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class VoiceChatWSController {
	private final SimpMessagingTemplate messagingTemplate;
	private final VoiceChatService voiceChatService;

	@MessageMapping("/team/{teamId}/voice/status")
	public void handleVoiceStatus(
		@DestinationVariable(value = "teamId") Long teamId,
		@Payload VoiceEventRequestDto requestDto) {

		VoiceEventResponseDto responseDto = VoiceEventResponseDto.builder()
			.userId(requestDto.getUserId())
			.teamId(teamId)
			.type(requestDto.getType())
			.status(requestDto.isStatus())
			.build();

		messagingTemplate.convertAndSend("/sub/team/" + teamId + "/voice/status",
			WebSocketResponse.withData(String.valueOf(responseDto.getType()), responseDto));
	}
	@MessageMapping("/team/{teamId}/voice/join")
	public void handleJoin(
		@DestinationVariable(value = "teamId") Long teamId,
		@Payload VoiceChatRequestDto requestDto) {
		voiceChatService.updateParticipantStatus(teamId, requestDto.getUserId(), true);
	}

	@MessageMapping("/team/{teamId}/voice/leave")
	public void handleLeave(
		@DestinationVariable(value = "teamId") Long teamId,
		@Payload VoiceChatRequestDto requestDto) {
		voiceChatService.leaveVoiceChat(teamId, requestDto.getUserId());
	}
}
