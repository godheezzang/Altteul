package com.c203.altteulbe.game.web.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import com.c203.altteulbe.game.service.JudgeService;
import com.c203.altteulbe.game.web.dto.judge.request.SubmitCodeRequestDto;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class JudgeWebSocketController {

	JudgeService judgeService;

	@MessageMapping("/judge/submition")
	@PreAuthorize("isAuthenticated()")
	public void handleSubmission(@Payload SubmitCodeRequestDto message, @AuthenticationPrincipal Long id) {
		judgeService.submitCode(message, id);
	}
}
