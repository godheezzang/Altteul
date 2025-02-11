package com.c203.altteulbe.openvidu.web.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.openvidu.service.VoiceChatService;
import com.c203.altteulbe.openvidu.web.dto.reqeust.MicStatusUpdateRequestDto;
import com.c203.altteulbe.openvidu.web.dto.response.VoiceChatJoinResponseDto;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teams/{teamId}/voice")
@Slf4j
public class VoiceChatController {
	private final VoiceChatService voiceChatService;

	@PostMapping("/join")
	public ApiResponseEntity<ResponseBody.Success<Map<String, Object>>> joinVoiceChat(
		@PathVariable(value = "teamId") Long teamId,
		@AuthenticationPrincipal Long userId) {
		try {
			Connection connection = voiceChatService.initializeVoiceSession(teamId, userId.toString());
			return ApiResponse.success(Map.of("token", connection.getToken()), HttpStatus.OK);
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			log.error("보이스 연결 실패", e);
			return ApiResponse.success(Map.of("token", e.getMessage()),
				HttpStatus.INTERNAL_SERVER_ERROR, "보이스 연결 실패");
		}
	}

	@PostMapping("/mic-status")
	public ApiResponseEntity<Void> updateMicStatus(
		@PathVariable(value = "teamId") Long teamId,
		@AuthenticationPrincipal Long userId,
		@RequestBody MicStatusUpdateRequestDto requestDto) {
		voiceChatService.updateMicStatus(teamId, userId.toString(), requestDto.getIsMuted());
		return ApiResponse.success();
	}

	@PostMapping("/leave")
	public ApiResponseEntity<Void> leaveVoiceChat(
		@PathVariable(value = "teamId") Long teamId,
		@AuthenticationPrincipal Long userId) {
		voiceChatService.leaveVoiceChat(teamId, userId.toString());
		return ApiResponse.success();
	}

	@GetMapping("/state")
	public ApiResponseEntity<ResponseBody.Success<VoiceChatJoinResponseDto>> getVoiceState(
		@PathVariable(value = "teamId") Long teamId) {
		return ApiResponse.success(voiceChatService.getTeamVoiceState(teamId), HttpStatus.OK);
	}
}
