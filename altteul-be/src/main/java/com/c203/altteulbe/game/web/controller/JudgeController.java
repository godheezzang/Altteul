package com.c203.altteulbe.game.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.game.service.JudgeService;
import com.c203.altteulbe.game.web.dto.request.GetHeartbeatRequest;
import com.c203.altteulbe.game.web.dto.request.SubmitCodeRequest;
import com.c203.altteulbe.game.web.dto.response.GetHeartbeatResponse;
import com.c203.altteulbe.game.web.dto.response.JudgeResponse;
import com.c203.altteulbe.game.web.dto.response.PingResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class JudgeController {

	private final JudgeService judgeService;

	@PostMapping("/judge-ping-check")
	public ResponseEntity<GetHeartbeatResponse> handleHeartbeat(@RequestHeader("X-JUDGE-SERVER-TOKEN") String token, @RequestBody GetHeartbeatRequest request) {
		System.out.println(token);
		ResponseEntity<GetHeartbeatResponse> response = ResponseEntity.ok(GetHeartbeatResponse.builder()
				.error(false)
				.data(request)
				.build());
		return response;
	}

	@PostMapping("/judge/ping")
	public ResponseEntity<PingResponse> checkServerStatus() {
		return ResponseEntity.ok(judgeService.getSystemInfo());
	}

	@PostMapping("/judge/submit")
	public ResponseEntity<JudgeResponse> submitCode(@RequestBody SubmitCodeRequest request) {
		JudgeResponse response = judgeService.judgeSubmission(request);
		judgeService.handleJudgeError(response);
		return ResponseEntity.ok(response);
	}
}
