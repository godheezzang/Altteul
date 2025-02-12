package com.c203.altteulbe.game.service.judge;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.c203.altteulbe.game.web.dto.judge.response.CodeExecutionResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.CodeSubmissionOpponentResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.CodeSubmissionTeamResponseDto;
import com.c203.altteulbe.websocket.dto.response.WebSocketResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JudgeWebsocketService {
	private final SimpMessagingTemplate simpMessagingTemplate;
	public void sendTeamSubmissionResult(CodeSubmissionTeamResponseDto codeSubmissionTeamResponseDto,
		Long gameId, Long teamId) {
		// 우리 팀 구독 경로로 결과 전송 (자세한 테스트케이스 결과 포함 or 에러 메세지)
		simpMessagingTemplate.convertAndSend(
			"/sub/" + gameId + "/" + teamId + "/team-submission/result",
			WebSocketResponse.withData("팀 제출 결과", codeSubmissionTeamResponseDto));
	}

	public void sendOpponentSubmissionResult(CodeSubmissionOpponentResponseDto codeSubmissionOpponentResponseDto,
		Long gameId, Long teamId) {
		// 상대 팀 구독 경로로 결과 전송 (간략한 정보만 전송)
		simpMessagingTemplate.convertAndSend(
			"/sub/" + gameId + "/" + teamId + "/opponent-submission/result",
			WebSocketResponse.withData("상대 팀 제출 결과",codeSubmissionOpponentResponseDto));
	}

	public void sendExecutionResult(CodeExecutionResponseDto codeExecutionResponseDto, Long gameId, Long teamId) {
		// 우리 팀 구독 경로로 결과 전송 (자세한 테스트케이스 결과 포함 or 에러 메세지)
		simpMessagingTemplate.convertAndSend(
			"/sub/" + gameId + "/" + teamId + "/execution/result",
			WebSocketResponse.withData("코드 실행 결과",codeExecutionResponseDto));
	}
}
