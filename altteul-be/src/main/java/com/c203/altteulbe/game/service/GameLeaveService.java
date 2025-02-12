package com.c203.altteulbe.game.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.dto.BattleResult;
import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.repository.game.GameRepository;
import com.c203.altteulbe.game.service.exception.GameNotFoundException;
import com.c203.altteulbe.room.persistent.entity.SingleRoom;
import com.c203.altteulbe.room.persistent.entity.UserTeamRoom;
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRedisRepository;
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRepository;
import com.c203.altteulbe.room.persistent.repository.team.TeamRoomRedisRepository;
import com.c203.altteulbe.room.persistent.repository.team.TeamRoomRepository;
import com.c203.altteulbe.room.persistent.repository.team.UserTeamRoomRepository;
import com.c203.altteulbe.room.service.RoomValidator;
import com.c203.altteulbe.room.service.RoomWebSocketService;
import com.c203.altteulbe.room.service.exception.RoomNotFoundException;
import com.c203.altteulbe.room.service.exception.UserNotInRoomException;
import com.c203.altteulbe.room.web.dto.response.SingleGameLeaveResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;
import com.c203.altteulbe.user.web.dto.response.UserInfoResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameLeaveService {
	private final UserJPARepository userJPARepository;
	private final RoomValidator roomValidator;
	private final SingleRoomRedisRepository singleRoomRedisRepository;
	private final TeamRoomRedisRepository teamRoomRedisRepository;
	private final GameRepository gameRepository;
	private final RedisTemplate<String, String> redisTemplate;
	private final SingleRoomRepository singleRoomRepository;
	private final TeamRoomRepository teamRoomRepository;
	private final RoomWebSocketService roomWebSocketService;
	private final UserTeamRoomRepository userTeamRoomRepository;

	@Transactional
	public void leaveGame(Long userId) {
		User user = userJPARepository.findByUserId(userId)
			.orElseThrow(NotFoundUserException::new);

		// 유저가 속한 방 ID 조회 (Redis에서)
		Long roomId;
		if (roomValidator.isUserInAnyRoom(userId, BattleType.S)) {
			roomId = singleRoomRedisRepository.getRoomIdByUser(userId);
		} else if (roomValidator.isUserInAnyRoom(userId, BattleType.T)) {
			roomId = teamRoomRedisRepository.getRoomIdByUser(userId);
		} else {
			throw new UserNotInRoomException();
		}

		// 게임 정보 조회 (이미 구현된 메서드 활용)
		Game game = gameRepository.findWithRoomByGameId(roomId)
			.orElseThrow(GameNotFoundException::new);

		if (!game.isInProgress()) {
			throw new GameNotInProgressException();
		}

		// 게임 타입에 따라 처리
		if (game.getBattleType() == BattleType.S) {
			handleSingleGameLeave(game, user);
		} else {
			handleTeamGameLeave(game, user);
		}

	}

	// 개인전 퇴장 처리
	private void handleSingleGameLeave(Game game, User user) {
		SingleRoom userRoom = singleRoomRepository.findByUserUserId(user.getUserId())
			.orElseThrow(RoomNotFoundException::new);
		Long roomId = userRoom.getId();

		// Redis에서 유저 정보 삭제
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
		redisTemplate.opsForList().remove(roomUsersKey, 0, user.getUserId().toString());
		redisTemplate.delete(RedisKeys.userSingleRoom(user.getUserId()));

		// 남은 유저 정보 조회
		List<String> remainingUserIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);
		List<UserInfoResponseDto> remainingUsers = getRemainingUsers(remainingUserIds);

		// 퇴장한 유저의 결과를 FAIL로 설정
		userRoom.setBattleResult(BattleResult.FAIL);
		singleRoomRepository.save(userRoom);

		// 퇴장 이벤트 전송
		SingleGameLeaveResponseDto responseDto = SingleGameLeaveResponseDto.builder()
			.gameId(game.getId())
			.roomId(roomId)
			.leftUser(UserInfoResponseDto.fromEntity(user))
			.remainingUsers(remainingUsers)
			.build();

		roomWebSocketService.sendWebSocketMessage(
			roomId.toString(),
			"GAME_LEAVE",
			responseDto,
			BattleType.S
		);

		// 모든 유저가 퇴장한 경우 게임 종료
		if (remainingUsers.isEmpty()) {
			game.cancelGame();
			gameRepository.save(game);

			Map<String, Object> gameEndPayload = Map.of(
				"gameId", game.getId(),
				"reason", "ALL_PLAYERS_LEFT"
			);

			roomWebSocketService.sendWebSocketMessage(
				roomId.toString(),
				"GAME_END",
				gameEndPayload,
				BattleType.S
			);

			cleanupSingleGameRedisData(roomId);
		}
	}

	// 팀전 퇴장 처리
	private void handleTeamGameLeave(Game game, User user) {
		UserTeamRoom userTeamRoom = userTeamRoomRepository.findByUser_UserId((user.getUserId())
			.orElseThrow(() -> new RoomNotFoundException());
		Long roomId = userTeamRoom.getTeamRoom().getId();

		// Redis에서 유저 정보 삭제
		String roomUsersKey = RedisKeys.TeamRoomUsers(roomId);
		redisTemplate.opsForList().remove(roomUsersKey, 0, user.getUserId().toString());
		redisTemplate.delete(RedisKeys.userTeamRoom(user.getUserId()));

		// 남은 유저 정보 조회 및 팀별 그룹화
		Map<Long, List<UserInfoResponseDto>> remainingUsersByTeam = getRemainingTeamUsers(game);

		// 음성 채팅 연결 종료
		voiceChatService.terminateUserVoiceConnection(roomId, user.getUserId().toString());

		// 퇴장 이벤트 전송
		TeamGameLeaveResponseDto responseDto = TeamGameLeaveResponseDto.of(
			game.getId(),
			roomId,
			UserInfoResponseDto.fromEntity(user),
			remainingUsersByTeam
		);

		String matchId = redisTemplate.opsForValue().get(RedisKeys.TeamMatchId(roomId));
		roomWebSocketService.sendWebSocketMessage(
			matchId,
			"GAME_LEAVE",
			responseDto,
			BattleType.T
		);

		// 한 팀이 전부 퇴장한 경우 게임 종료
		if (!remainingUsersByTeam.containsKey(roomId)) {
			game.cancelGame();
			gameRepository.save(game);

			// 남은 팀 승리 처리
			Long winningTeamId = remainingUsersByTeam.keySet().iterator().next();
			TeamRoom winningTeam = teamRoomRepository.findById(winningTeamId)
				.orElseThrow(() -> new RoomNotFoundException());
			winningTeam.updateStatusByGameClear(BattleResult.WIN);

			// 퇴장한 팀 패배 처리
			TeamRoom losingTeam = teamRoomRepository.findById(roomId)
				.orElseThrow(() -> new RoomNotFoundException());
			losingTeam.setBattleResult(BattleResult.LOSE);

			teamRoomRepository.saveAll(Arrays.asList(winningTeam, losingTeam));

			// 게임 종료 이벤트 전송
			Map<String, Object> gameEndPayload = Map.of(
				"gameId", game.getId(),
				"reason", "TEAM_FORFEITED",
				"winningTeamId", winningTeamId
			);

			roomWebSocketService.sendWebSocketMessage(
				matchId,
				"GAME_END",
				gameEndPayload,
				BattleType.T
			);

			// Redis 데이터 정리
			String opposingRoomId = matchId.replace(roomId.toString(), "").replace("-", "");
			cleanupTeamGameRedisData(roomId, opposingRoomId);

			// Voice 채팅 세션 종료
			voiceChatService.terminateTeamVoiceSession(roomId);
			voiceChatService.terminateTeamVoiceSession(Long.parseLong(opposingRoomId));
		}
}
