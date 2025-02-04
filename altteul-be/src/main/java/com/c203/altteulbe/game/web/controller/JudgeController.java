package com.c203.altteulbe.game.web.controller;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.game.service.JudgeService;
import com.c203.altteulbe.game.web.dto.judge.request.GetHeartbeatRequestDto;
import com.c203.altteulbe.game.web.dto.judge.request.SubmitCodeRequestDto;
import com.c203.altteulbe.game.web.dto.judge.response.GetHeartbeatResponse;
import com.c203.altteulbe.game.web.dto.judge.response.JudgeResponse;
import com.c203.altteulbe.game.web.dto.judge.response.PingResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class JudgeController {

	private final JudgeService judgeService;

	@PostMapping("/judge/check")
	public ResponseEntity<GetHeartbeatResponse> handleHeartbeat(@RequestHeader("X-JUDGE-SERVER-TOKEN") String token, @RequestBody GetHeartbeatRequestDto request) {
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
	public ResponseEntity<JudgeResponse> submitCode(@RequestBody SubmitCodeRequestDto request, @AuthenticationPrincipal Long id) {
		JudgeResponse response = judgeService.judgeSubmission(request);
		judgeService.handleJudgeError(response);
		return ResponseEntity.ok(response);
	}

	@MessageMapping("/judge/submition")
	public void handleSubmission(@Payload SubmitCodeRequestDto message) {

		// 1. 샌드박스 환경에서 제출된 코드 실행 및 채점
		GradingResult result = judgeService.judgeSubmission(message);

		// 2. 우리 팀 구독 경로로 결과 전송 (자세한 테스트케이스 결과 포함)
		messagingTemplate.convertAndSend("/sub/" + message.getGameId() + "/team-submission/result", result);

		// 3. 상대 팀 구독 경로로 결과 전송 (간략한 정보만 전송)
		OpponentResult oppResult = new OpponentResult(result.getStatus(), result.getPassCount(), result.getTotalCount());
		messagingTemplate.convertAndSend("/sub/" + message.getGameId() + "/opponent-submission/result", oppResult);
	}

	// 더미 채점 로직 (실제 환경에서는 샌드박스 실행, 예외 처리, DB 저장 등을 구현)
	private GradingResult judgeSubmission(SubmissionMessage message) {
		// 예를 들어 미리 정의된 두 개의 테스트케이스 결과를 생성
		List<TestCaseResult> testCases = new ArrayList<>();
		testCases.add(new TestCaseResult(1L, 1, "P", 500, 500000));
		testCases.add(new TestCaseResult(2L, 2, "F", 480, 582000));

		// passCount: 통과한 테스트 개수, totalCount: 전체 테스트 케이스 수
		return new GradingResult("P", testCases, 1, 2);
	}
}
