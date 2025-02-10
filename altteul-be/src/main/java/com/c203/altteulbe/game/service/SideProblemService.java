package com.c203.altteulbe.game.service;

import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.entity.side.SideProblem;
import com.c203.altteulbe.game.persistent.entity.side.SideProblemHistory;
import com.c203.altteulbe.game.persistent.repository.game.GameRepository;
import com.c203.altteulbe.game.persistent.repository.side.SideProblemHistoryJPARepository;
import com.c203.altteulbe.game.persistent.repository.side.SideProblemRepository;
import com.c203.altteulbe.game.service.exception.GameNotFoundException;
import com.c203.altteulbe.game.web.dto.side.request.ReceiveSideProblemRequestDto;
import com.c203.altteulbe.game.web.dto.side.request.SubmitSideProblemRequestDto;
import com.c203.altteulbe.game.web.dto.side.response.ReceiveSideProblemResponseDto;
import com.c203.altteulbe.game.web.dto.side.response.SubmitSideProblemResponseDto;
import com.c203.altteulbe.room.persistent.entity.Room;
import com.c203.altteulbe.room.persistent.entity.SingleRoom;
import com.c203.altteulbe.room.persistent.entity.TeamRoom;
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRepository;
import com.c203.altteulbe.room.persistent.repository.team.TeamRoomRepository;
import com.c203.altteulbe.room.service.exception.RoomNotFoundException;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.persistent.repository.UserRepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SideProblemService {

	private final SideProblemRepository sideProblemRepository;
	private final SideProblemHistoryJPARepository sideProblemHistoryJPARepository;
	private final TeamRoomRepository teamRoomRepository;
	private final SideProblemWebsocketService sideProblemWebsocketService;
	private final GameRepository gameRepository;
	private final SingleRoomRepository singleRoomRepository;
	private final UserJPARepository userJPARepository;

	public void submit(SubmitSideProblemRequestDto message, Long id) {
		// 제출된 결과 확인
		SideProblem sideProblem = sideProblemRepository.findById(message.getSideProblemId())
			.orElseThrow(() -> new BusinessException("사이드 문제를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));

		SideProblemHistory.ProblemResult result = message.getAnswer().equals(sideProblem.getAnswer()) ? SideProblemHistory.ProblemResult.P: SideProblemHistory.ProblemResult.F;

		// 채점 결과 브로드 캐스트
		sideProblemWebsocketService.sendSubmissionResult(
			SubmitSideProblemResponseDto.builder()
			.status(result)
			.build(),
			message.getGameId(),
			message.getTeamId()
		);

		// 결과를 사이드 문제 풀이내역에 저장
		// 게임 찾기
		Game game = gameRepository.findWithRoomByGameId(message.getGameId())
			.orElseThrow(GameNotFoundException::new);

		SideProblemHistory sideProblemHistory = null;
		User user = userJPARepository.findByUserId(id)
			.orElseThrow(NotFoundUserException::new);

		if (game.getBattleType() == BattleType.S) {
			sideProblemHistory = SideProblemHistory.builder()
				.sideProblemId(message.getSideProblemId())
				.gameId(game)
				.result(result)
				.teamRoomId(null)
				.userId(user)
				.userAnswer(message.getAnswer())
				.build();
		} else {
			TeamRoom teamRoom = teamRoomRepository.findById(message.getTeamId())
				.orElseThrow(RoomNotFoundException::new);
			sideProblemHistory = SideProblemHistory.builder()
				.sideProblemId(message.getSideProblemId())
				.gameId(game)
				.result(result)
				.teamRoomId(teamRoom)
				.userId(user)
				.userAnswer(message.getAnswer())
				.build();
		}
		sideProblemHistoryJPARepository.save(sideProblemHistory);
	}

	public void receive(ReceiveSideProblemRequestDto message, Long id) {
		// 팀의 문제를 구독하는 사람에게 문제 전달
		long totalCount = sideProblemRepository.count();

		// 게임 찾기
		Game game = gameRepository.findWithRoomByGameId(message.getGameId())
			.orElseThrow(GameNotFoundException::new);

		List<SideProblemHistory> histories = null;

		if (game.getBattleType() == BattleType.S) {
			SingleRoom room = singleRoomRepository.findById(message.getTeamId())
				.orElseThrow(() -> new BusinessException("개인 룸을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
			histories = sideProblemHistoryJPARepository.findByUserId(room.getUser());
		} else {
			TeamRoom room = teamRoomRepository.findById(message.getTeamId())
				.orElseThrow(() -> new BusinessException("팀 룸을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
			histories = sideProblemHistoryJPARepository.findByTeamRoomId(room);
		}

		// 이전에 풀었던 문제 추출
		Set<Long> solved = new HashSet<>();
		for (SideProblemHistory history : histories) {
			solved.add(history.getSideProblemId());
		}

		Random random = new Random();

		// 랜덤 번호와 안겹칠때까지 찾고 추출
		SideProblem nextProblem = null;
		while (solved.size() < 6) {
			long randomId = random.nextLong(totalCount) + 1; // 1부터 totalCount까지의 랜덤 숫자
			if (solved.add(randomId)) {
				nextProblem = sideProblemRepository.findById(randomId)
					.orElseThrow(() -> new BusinessException("사이드 문제를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));
			}
		}

		if (nextProblem == null) {
			throw new NullPointerException();
		}

		sideProblemWebsocketService.sendSideProblem(
			ReceiveSideProblemResponseDto.builder()
				.id(nextProblem.getId())
				.title(nextProblem.getTitle())
				.description(nextProblem.getContent())
				.build(),
			message.getGameId(),
			message.getTeamId()
		);
	}
}
