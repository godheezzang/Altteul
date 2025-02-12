package com.c203.altteulbe.game.web.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.game.service.judge.JudgeService;
import com.c203.altteulbe.game.web.dto.judge.request.GetHeartbeatRequestDto;
import com.c203.altteulbe.game.web.dto.judge.request.SubmitCodeRequestDto;
import com.c203.altteulbe.game.web.dto.judge.response.CodeExecutionResponseDto;
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
	public GetHeartbeatResponse handleHeartbeat(@RequestHeader("X-JUDGE-SERVER-TOKEN") String token, @RequestBody GetHeartbeatRequestDto request) {
		return GetHeartbeatResponse.builder()
			.error(false)
			.data(request)
			.build();
	}

	@PostMapping("/judge/ping")
	public ApiResponseEntity<ResponseBody.Success<PingResponse>> checkServerStatus() {
		return ApiResponse.success(judgeService.getSystemInfo());
	}

	@PostMapping("/judge/submit")
	public ApiResponseEntity<ResponseBody.Success<JudgeResponse>> submitCode(@RequestBody SubmitCodeRequestDto request) {
		return ApiResponse.success(judgeService.submitToJudge(request, "problem_"));
	}

	@PostMapping("/judge/execution")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<CodeExecutionResponseDto>> executeCode(@RequestBody SubmitCodeRequestDto request) {
		return ApiResponse.success(judgeService.executeCode(request));
	}
}
