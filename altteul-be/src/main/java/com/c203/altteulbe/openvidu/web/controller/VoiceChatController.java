package com.c203.altteulbe.openvidu.web.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.openvidu.service.VoiceChatService;
import com.c203.altteulbe.openvidu.web.dto.reqeust.MicStatusUpdateRequestDto;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/team/{roomUUID}/voice")
@Slf4j
public class VoiceChatController {
	private final VoiceChatService voiceChatService;

	// 음성 채팅 참여
	@PostMapping("/join")
	public ApiResponseEntity<?> joinVoiceChat(
		@PathVariable(value = "roomUUID") Long roomUUID,
		@AuthenticationPrincipal Long userId) {
		try {
			Connection connection = voiceChatService.initializeVoiceSession(roomUUID, userId.toString());
			return ApiResponse.success(Map.of("token", connection.getToken()), HttpStatus.OK);
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			log.error("보이스 연결 실패", e);
			return ApiResponse.error("보이스 연결 실패", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 자신의 마이크 상태 업데이트 (음소거/음소거 해제)
	@PostMapping("/mic-status")
	public ApiResponseEntity<Void> updateMicStatus(
		@PathVariable(value = "roomUUID") Long roomUUID,
		@AuthenticationPrincipal Long userId,
		@RequestBody MicStatusUpdateRequestDto requestDto) {
		voiceChatService.updateMicStatus(roomUUID, userId.toString(), requestDto.getIsMuted());
		return ApiResponse.success();
	}
}
