package com.c203.altteulbe.game.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.c203.altteulbe.game.service.exception.JudgeCompileException;
import com.c203.altteulbe.game.service.exception.JudgeServerException;
import com.c203.altteulbe.game.web.dto.judge.request.JudgeRequestDto;
import com.c203.altteulbe.game.web.dto.judge.request.SubmitCodeRequestDto;
import com.c203.altteulbe.game.web.dto.judge.request.lang.LangDto;
import com.c203.altteulbe.game.web.dto.judge.request.lang.LangDtoFactory;
import com.c203.altteulbe.game.web.dto.judge.response.CodeSubmitionOpponentResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.CodeSubmitionTeamResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.JudgeResponse;
import com.c203.altteulbe.game.web.dto.judge.response.PingResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JudgeService {
	private final RestTemplate restTemplate;

	@Value("${judge.server.url}")
	private String judgeServerUrl;

	private final SimpMessagingTemplate simpMessagingTemplate;

	private final String PROBLEM_PREFIX = "problem_";

	// 시스템 정보 조회
	public PingResponse getSystemInfo() {
		String url = judgeServerUrl + "/ping";
		return restTemplate.postForObject(url, null, PingResponse.class);
	}

	// 일반 채점 실행
	public void judgeSubmission(SubmitCodeRequestDto request, Long id) {
		// 채점 서버 url
		String url = judgeServerUrl + "/judge";
		String problemFolderName = PROBLEM_PREFIX + request.getProblemId();

		// 언어에 따른 설정 분리
		LangDto langDto = switch (request.getLang()) {
			case "JV" -> LangDtoFactory.createJavaLangDto();
			case "PY" -> LangDtoFactory.createPython3LangDto();
			case "CPP" -> LangDtoFactory.createCppLangDto();
			case "JS" -> LangDtoFactory.createJSLangDto();
			default -> null;
		};

		// 문제의 테스트 번호에 따라 제한 시간 정보 호출

		JudgeRequestDto judgeRequestDto = JudgeRequestDto.builder()
			.src(request.getCode())
			.language_config(langDto)
			.max_cpu_time(1000L)
			.max_memory(100*1024*1024L)
			.test_case_id(problemFolderName)
			.output(true)
			.build();

		JudgeResponse result  = restTemplate.postForObject(url, judgeRequestDto, JudgeResponse.class);

		// 예외 처리
		if (result != null) handleJudgeError(result);
		else throw new NullPointerException();

		// 2. 우리 팀 구독 경로로 결과 전송 (자세한 테스트케이스 결과 포함)
		simpMessagingTemplate.convertAndSend(
			"/sub/" + request.getGameId() + "/" + request.getTeamId() + "/team-submission/result",
			CodeSubmitionTeamResponseDto.from(result));

		// 3. 상대 팀 구독 경로로 결과 전송 (간략한 정보만 전송)
		CodeSubmitionOpponentResponseDto oppResult = CodeSubmitionOpponentResponseDto.builder().build();
		simpMessagingTemplate.convertAndSend(
			"/sub/" + request.getGameId() + "/" + request.getTeamId() + "/opponent-submission/result",
			CodeSubmitionOpponentResponseDto.from(result));
	}

	// 컴파일 에러 처리
	public void handleJudgeError(JudgeResponse response) {
		if (response.getErr() != null) {
			if (response.getErr().equals("CompileError")) {
				throw new JudgeCompileException(response.getData().toString());
			}
			throw new JudgeServerException();
		}
	}
}

