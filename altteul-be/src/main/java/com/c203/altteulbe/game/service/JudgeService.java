package com.c203.altteulbe.game.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.game.persistent.entity.Problem;
import com.c203.altteulbe.game.persistent.repository.problem.ProblemRepository;
import com.c203.altteulbe.game.service.exception.JudgeCompileException;
import com.c203.altteulbe.game.service.exception.JudgeServerException;
import com.c203.altteulbe.game.web.dto.judge.request.JudgeRequestDto;
import com.c203.altteulbe.game.web.dto.judge.request.SubmitCodeRequestDto;
import com.c203.altteulbe.game.web.dto.judge.request.lang.LangDto;
import com.c203.altteulbe.game.web.dto.judge.request.lang.LangDtoFactory;
import com.c203.altteulbe.game.web.dto.judge.response.CodeExecutionResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.CodeSubmissionOpponentResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.CodeSubmissionTeamResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.JudgeResponse;
import com.c203.altteulbe.game.web.dto.judge.response.PingResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class JudgeService {
	private final RestTemplate restTemplate;
	private final JudgeWebsocketService judgeWebsocketService;
	private final ProblemRepository problemRepository;

	@Value("${judge.server.url}")
	private String judgeServerUrl;

	private final String PROBLEM_PREFIX = "problem_";
	private final String EXAMPLE_PREFIX = "example_";

	// 시스템 정보 조회
	public PingResponse getSystemInfo() {
		String url = judgeServerUrl + "/ping";
		return restTemplate.postForObject(url, null, PingResponse.class);
	}

	// 일반 채점 실행
	public JudgeResponse submitToJudge(SubmitCodeRequestDto request, Long id, String prefix) {
		// 채점 서버 url
		String url = judgeServerUrl + "/judge";
		String problemFolderName = prefix + request.getProblemId();

		Problem problem = problemRepository.findById(request.getProblemId())
			.orElseThrow(() -> new BusinessException("문제를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST));

		// 언어에 따른 설정 분리
		LangDto langDto = switch (request.getLang()) {
			case "JV" -> LangDtoFactory.createJavaLangDto();
			case "PY" -> LangDtoFactory.createPython3LangDto();
			case "CPP" -> LangDtoFactory.createCppLangDto();
			case "JS" -> LangDtoFactory.createJSLangDto();
			default -> null;
		};

		JudgeRequestDto judgeRequestDto = JudgeRequestDto.builder()
			.src(request.getCode())
			.language_config(langDto)
			.max_cpu_time(1000L) // 기본 1초
			.max_memory(100*1024*1024L) // 기본 100MB
			.test_case_id(problemFolderName)
			.output(true)
			.build();

		return restTemplate.postForObject(url, judgeRequestDto, JudgeResponse.class);
	}

	/**
	 * 저지에게 평가받을 결과를 호출하여 메세지를 발송하는 함수
	 * @param request : request dto
	 * @param id : username
	 */
	public void submitCode(SubmitCodeRequestDto request, Long id) {
		// 저지에게 코드 제출
		JudgeResponse judgeResponse = submitToJudge(request, id, PROBLEM_PREFIX);

		if (judgeResponse == null) throw new NullPointerException();

		CodeSubmissionTeamResponseDto teamResponseDto = CodeSubmissionTeamResponseDto.from(judgeResponse);
		CodeSubmissionOpponentResponseDto opponentResponseDto = CodeSubmissionOpponentResponseDto.builder()
			.totalCount(teamResponseDto.getTotalCount())
			.passCount(teamResponseDto.getPassCount())
			.status(teamResponseDto.getStatus())
			.build();

		// 채점 결과 팀별로 메세지 전송
		judgeWebsocketService.sendTeamSubmissionResult(teamResponseDto,
			request.getGameId(),
			request.getTeamId());

		judgeWebsocketService.sendOpponentSubmissionResult(opponentResponseDto,
			request.getGameId(),
			request.getTeamId());

		// 결과를 내역 db에 저장, 게임 db에 저장
		// 1. 내역 Entity 생성, 레포지토리 쿼리문 생성, 언어별 제한 테이블 추가
	}

	public void executeCode(SubmitCodeRequestDto request, Long id) {
		// 저지에게 코드 제출
		JudgeResponse judgeResponse = submitToJudge(request, id, EXAMPLE_PREFIX);

		if (judgeResponse == null) throw new NullPointerException();

		// request.problemId의 테스트케이스 1,2번 output 정보가 필요함

		CodeExecutionResponseDto.from(judgeResponse);

		// 채점 결과 메세지 전송
		judgeWebsocketService.sendExecutionResult(CodeExecutionResponseDto.from(judgeResponse), request.getGameId(), request.getTeamId());
	}

	// 컴파일 에러 처리
	private void handleExecutionError(JudgeResponse response) {
		if (response.getErr() != null) {
			if (response.getErr().equals("CompileError")) {
				throw new JudgeCompileException(response.getData().toString());
			} else if (response.getErr().equals("400")) {
				throw new RuntimeException(response.getData().toString());
			}
			throw new JudgeServerException();
		}
	}
}

