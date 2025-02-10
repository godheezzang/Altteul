package com.c203.altteulbe.game.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.c203.altteulbe.common.dto.BattleResult;
import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.entity.problem.Problem;
import com.c203.altteulbe.game.persistent.entity.TestHistory;
import com.c203.altteulbe.game.persistent.entity.TestResult;
import com.c203.altteulbe.game.persistent.repository.game.GameRepository;
import com.c203.altteulbe.game.persistent.repository.history.TestHistoryRepository;
import com.c203.altteulbe.game.persistent.repository.problem.ProblemRepository;
import com.c203.altteulbe.game.web.dto.judge.request.JudgeRequestDto;
import com.c203.altteulbe.game.web.dto.judge.request.SubmitCodeRequestDto;
import com.c203.altteulbe.game.web.dto.judge.request.lang.LangDto;
import com.c203.altteulbe.game.web.dto.judge.request.lang.LangDtoFactory;
import com.c203.altteulbe.game.web.dto.judge.response.CodeExecutionResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.CodeSubmissionOpponentResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.CodeSubmissionTeamResponseDto;
import com.c203.altteulbe.game.web.dto.judge.response.JudgeResponse;
import com.c203.altteulbe.game.web.dto.judge.response.PingResponse;
import com.c203.altteulbe.game.web.dto.judge.response.TestCaseResponseDto;
import com.c203.altteulbe.room.persistent.entity.Room;
import com.c203.altteulbe.room.persistent.entity.SingleRoom;
import com.c203.altteulbe.room.persistent.entity.TeamRoom;
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRepository;
import com.c203.altteulbe.room.persistent.repository.team.TeamRoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class JudgeService {
	private final RestTemplate restTemplate;
	private final JudgeWebsocketService judgeWebsocketService;
	private final ProblemRepository problemRepository;
	private final TestHistoryRepository testHistoryRepository;
	private final GameRepository gameRepository;
	private final SingleRoomRepository singleRoomRepository;
	private final TeamRoomRepository teamRoomRepository;

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
	public JudgeResponse submitToJudge(SubmitCodeRequestDto request, String prefix) {
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
		JudgeResponse judgeResponse = submitToJudge(request, PROBLEM_PREFIX);

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

		int maxMemory = -1;
		int maxExecutionTime = -1;
		if (judgeResponse.isNotCompileError()) {
			for (TestCaseResponseDto testCase:teamResponseDto.getTestCases()) {
				maxMemory = Math.max(maxMemory, Integer.parseInt(testCase.getExecutionMemory()));
				maxExecutionTime = Math.max(maxExecutionTime, Integer.parseInt(testCase.getExecutionTime()));
			}
		}

		TestHistory testHistory = TestHistory.from(
			teamResponseDto,
			request.getGameId(),
			request.getProblemId(),
			id,
			String.valueOf(maxExecutionTime),
			String.valueOf(maxMemory),
			request.getCode(),
			request.getLang()
		);
		Game game = gameRepository.findWithRoomByGameId(request.getGameId())
			.orElseThrow(() -> new BusinessException("게임 찾을 수 없음", HttpStatus.NOT_FOUND));
		//팀방, 개인방인 경우를 분리해서 로직 진행
		if (game.getBattleType() == BattleType.S) {
			List<SingleRoom> rooms = game.getSingleRooms();
			//내 팀이 어디지?
			SingleRoom myRoom = rooms.stream()
				.filter(room -> room.getId().equals(request.getTeamId()))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("해당 팀의 방을 찾을 수 없습니다."));
			// 내 팀의 최고 점수 업데이트
			updateRoomSubmission(myRoom, testHistory, request.getCode(), maxExecutionTime, maxMemory, rooms);
			singleRoomRepository.save(myRoom);
		} else {
			List<TeamRoom> rooms = game.getTeamRooms();
			//내 팀이 어디지?
			TeamRoom myRoom = rooms.stream()
				.filter(room -> room.getId().equals(request.getTeamId()))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("해당 팀의 방을 찾을 수 없습니다."));
			// 내 팀의 최고 점수 업데이트 (기존 점수보다 높을 시 업데이트)
			updateRoomSubmission(myRoom, testHistory, request.getCode(), maxExecutionTime, maxMemory, rooms);
			teamRoomRepository.save(myRoom);
		}

		List<TestResult> testResults = TestResult.from(judgeResponse, testHistory);
		testHistory.updateTestResults(testResults);
		testHistoryRepository.save(testHistory);
	}

	public CodeExecutionResponseDto executeCode(SubmitCodeRequestDto request) {
		// 저지에게 코드 제출
		JudgeResponse judgeResponse = submitToJudge(request, EXAMPLE_PREFIX);

		if (judgeResponse == null) throw new NullPointerException();

		// request.problemId의 테스트케이스 1,2번 output 정보가 필요함
		judgeWebsocketService.sendExecutionResult(CodeExecutionResponseDto.from(judgeResponse),
			request.getGameId(),
			request.getTeamId());

		// 없어도 되는데 걍 확인용으로 만듬
		return CodeExecutionResponseDto.from(judgeResponse);
	}

	// 함수 추출
	private void updateRoomSubmission(Room myRoom, TestHistory testHistory, String code, int maxExecutionTime, int maxMemory, List<? extends Room> rooms) {
		myRoom.updateSubmissionRecord(
			testHistory.getSuccessCount(),
			String.valueOf(maxExecutionTime),
			String.valueOf(maxMemory),
			code
		);

		// 다 맞춰서 게임 종료할 경우 로직
		if (testHistory.getFailCount() == 0) {
			// 순위 갱신: finishTime 이 있는 방들만 정렬
			int finishedTeamCount = (int) rooms.stream()
				.filter(room -> room.getFinishTime() != null) // finishTime 이 설정된 방만 선택
				.count();
			myRoom.updateStatusByGameClear(BattleResult.fromRank(finishedTeamCount + 1));
		}
	}
}

