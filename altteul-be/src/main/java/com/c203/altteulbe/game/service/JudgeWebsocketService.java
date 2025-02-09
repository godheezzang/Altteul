package com.c203.altteulbe.game.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.c203.altteulbe.game.web.dto.judge.response.CodeExecutionResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.CodeSubmissionOpponentResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.CodeSubmissionTeamResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JudgeWebsocketService {
	private final SimpMessagingTemplate simpMessagingTemplate;
	public void sendTeamSubmissionResult(CodeSubmissionTeamResponseDto codeSubmissionTeamResponseDto,
		Long gameId, Long teamId) {
		// 우리 팀 구독 경로로 결과 전송 (자세한 테스트케이스 결과 포함 or 에러 메세지)
		simpMessagingTemplate.convertAndSend(
			gameId + "/" + teamId + "/team-submission/result",
			codeSubmissionTeamResponseDto);
	}

	public void sendOpponentSubmissionResult(CodeSubmissionOpponentResponseDto codeSubmissionOpponentResponseDto,
		Long gameId, Long teamId) {
		// 상대 팀 구독 경로로 결과 전송 (간략한 정보만 전송)
		simpMessagingTemplate.convertAndSend(
			gameId + "/" + teamId + "/opponent-submission/result",
			codeSubmissionOpponentResponseDto);
	}

	public void sendExecutionResult(CodeExecutionResponseDto codeExecutionResponseDto, Long gameId, Long teamId) {
		// 우리 팀 구독 경로로 결과 전송 (자세한 테스트케이스 결과 포함 or 에러 메세지)
		simpMessagingTemplate.convertAndSend(
			gameId + "/" + teamId + "/execution/result",
			codeExecutionResponseDto);
	}
}
