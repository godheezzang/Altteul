package com.c203.altteulbe.game.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.c203.altteulbe.game.service.exception.JudgeCompileException;
import com.c203.altteulbe.game.service.exception.JudgeServerException;
import com.c203.altteulbe.game.web.dto.judge.request.JudgeRequestDto;
import com.c203.altteulbe.game.web.dto.judge.request.SubmitCodeRequestDto;
import com.c203.altteulbe.game.web.dto.judge.request.lang.LangDto;
import com.c203.altteulbe.game.web.dto.judge.request.lang.LangDtoFactory;
import com.c203.altteulbe.game.web.dto.judge.response.JudgeResponse;
import com.c203.altteulbe.game.web.dto.judge.response.PingResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JudgeService {
	private final RestTemplate restTemplate;

	@Value("${judge.server.url}")
	private String judgeServerUrl;

	// 시스템 정보 조회
	public PingResponse getSystemInfo() {
		String url = judgeServerUrl + "/ping";
		return restTemplate.postForObject(url, null, PingResponse.class);
	}

	// 일반 채점 실행
	public JudgeResponse judgeSubmission(SubmitCodeRequestDto request) {

		String url = judgeServerUrl + "/judge";

		LangDto langDto = switch (request.getLanguage()) {
			case "JV" -> LangDtoFactory.createJavaLangDto();
			case "PY" -> LangDtoFactory.createPython3LangDto();
			case "CPP" -> LangDtoFactory.createCppLangDto();
			case "JS" -> LangDtoFactory.createJSLangDto();
			default -> null;
		};

		JudgeRequestDto judgeRequestDto = JudgeRequestDto.builder()
			.src(request.getCode())
			.language_config(langDto)
			.max_cpu_time(1000L)
			.max_memory(20000L)
			.test_case_id(request.getProblemId())
			.output(true)
			.build();
		return restTemplate.postForObject(url, judgeRequestDto, JudgeResponse.class);
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

