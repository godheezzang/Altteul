package com.c203.altteulbe.game.web.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.c203.altteulbe.game.service.JudgeService;
import com.c203.altteulbe.game.web.dto.judge.request.SubmitCodeRequestDto;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class JudgeWSController {

	JudgeService judgeService;

	@MessageMapping("/judge/submition")
	@PreAuthorize("isAuthenticated()")
	public void handleSubmission(@Payload SubmitCodeRequestDto message, @AuthenticationPrincipal Long id) {
		// 1. 샌드박스 환경에서 제출된 코드 실행 및 채점
		judgeService.judgeSubmission(message, id);
	}
}
