package com.c203.altteulbe.game.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.dto.BattleResult;
import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.repository.game.GameRepository;
import com.c203.altteulbe.game.service.exception.GameNotFoundException;
import com.c203.altteulbe.game.web.dto.leave.response.SingleGameLeaveResponseDto;
import com.c203.altteulbe.game.web.dto.leave.response.TeamGameLeaveResponseDto;
import com.c203.altteulbe.openvidu.service.VoiceChatService;
import com.c203.altteulbe.room.persistent.entity.SingleRoom;
import com.c203.altteulbe.room.persistent.entity.TeamRoom;
import com.c203.altteulbe.room.persistent.entity.UserTeamRoom;
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRepository;
import com.c203.altteulbe.room.persistent.repository.team.TeamRoomRedisRepository;
import com.c203.altteulbe.room.persistent.repository.team.TeamRoomRepository;
import com.c203.altteulbe.room.persistent.repository.team.UserTeamRoomRepository;
import com.c203.altteulbe.room.service.RoomValidator;
import com.c203.altteulbe.room.service.RoomWebSocketService;
import com.c203.altteulbe.room.service.exception.RoomNotFoundException;
import com.c203.altteulbe.room.service.exception.UserNotInRoomException;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserRepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;
import com.c203.altteulbe.user.web.dto.response.UserInfoResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameLeaveService {
	private final UserRepository userRepository;
	private final RoomValidator roomValidator;
	private final TeamRoomRedisRepository teamRoomRedisRepository;
	private final GameRepository gameRepository;
	private final RedisTemplate<String, String> redisTemplate;
	private final SingleRoomRepository singleRoomRepository;
	private final TeamRoomRepository teamRoomRepository;
	private final RoomWebSocketService roomWebSocketService;
	private final UserTeamRoomRepository userTeamRoomRepository;
	private final VoiceChatService voiceChatService;

	@Transactional
	public void leaveGame(Long userId) {

		User user = userRepository.findByUserId(userId)
			.orElseThrow(NotFoundUserException::new);

		// 유저가 속한 방 ID 조회 (Redis에서)
		Long roomId;
		BattleType battleType;
		String dbRoomId;
		if (roomValidator.isUserInAnyRoom(userId, BattleType.S)) {
			battleType = BattleType.S;
			SingleRoom singleRoom = singleRoomRepository.findByUser_UserIdAndActivationIsTrue(userId).
				orElseThrow(RoomNotFoundException::new);
			dbRoomId = singleRoom.getId().toString();
		} else if (roomValidator.isUserInAnyRoom(userId, BattleType.T)) {
			roomId = teamRoomRedisRepository.getRoomIdByUser(userId);
			battleType = BattleType.T;
			dbRoomId = redisTemplate.opsForValue().get(RedisKeys.getRoomDbId(roomId));
			if (dbRoomId == null) {
				throw new GameNotFoundException();
			}
		} else {
			throw new UserNotInRoomException();
		}

		// 게임 정보 조회 (이미 구현된 메서드 활용)
		Game game = gameRepository.findWithGameByRoomIdAndType(Long.parseLong(dbRoomId), battleType)
			.orElseThrow(GameNotFoundException::new);
		if (!game.isInProgress()) {
			// 정상 종료된 게임 - 단순 정리 작업
			handleFinishedGameLeave(game, user);
		} else {
			// 진행 중인 게임 - 중도 퇴장 처리
			handleInProgressGameLeave(game, user);
		}
	}

	// 게임 정상 종료 후 나가기 처리
	private void handleFinishedGameLeave(Game game, User user) {
		if (game.getBattleType() == BattleType.S) {
			handleFinishedSingleGameLeave(game, user);
		} else {
			handleFinishedTeamGameLeave(game, user);
		}
	}

	// 게임 중간 퇴장 처리
	private void handleInProgressGameLeave(Game game, User user) {
		if (game.getBattleType() == BattleType.S) {
			handleInProgressSingleGameLeave(game, user);
		} else {
			handleInProgressTeamGameLeave(game, user);
		}
	}

	// 개인전 정상 종료 후 나가기 처리
	private void handleFinishedSingleGameLeave(Game game, User user) {
		SingleRoom userRoom = singleRoomRepository.findByUser_UserIdAndGame(user.getUserId(), game)
			.orElseThrow(RoomNotFoundException::new);
		Long roomId = userRoom.getId();
		String redisRoomId = redisTemplate.opsForValue().get(RedisKeys.userSingleRoom(user.getUserId()));
		String roomUsersKey = RedisKeys.SingleRoomUsers(Long.parseLong(Objects.requireNonNull(redisRoomId)));
		// Redis에서 유저 정보 삭제
		redisTemplate.execute(new SessionCallback<List<Object>>() {
			public List<Object> execute(RedisOperations operations) {
				operations.multi();

				// Redis 작업들
				operations.opsForList().remove(roomUsersKey, 0, user.getUserId().toString());
				operations.delete(RedisKeys.userSingleRoom(user.getUserId()));

				return operations.exec();
			}
		});

		// 남은 유저 정보 조회
		List<String> remainingUserIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);
		List<UserInfoResponseDto> remainingUsers = getRemainingUsers(remainingUserIds);

		// 퇴장 이벤트 전송
		SingleGameLeaveResponseDto responseDto = SingleGameLeaveResponseDto.of(
			game.getId(),
			roomId,
			UserInfoResponseDto.fromEntity(user),
			remainingUsers
		);

		roomWebSocketService.sendWebSocketMessage(
			redisRoomId,
			"GAME_FINISH_LEAVE",
			responseDto,
			BattleType.S
		);
	}

	// TODO : 팀전 정상 종료 후 나가기 처리
	private void handleFinishedTeamGameLeave(Game game, User user) {
		UserTeamRoom userTeamRoom = userTeamRoomRepository.findByUser_UserIdAndTeamRoom_Game(user.getUserId(), game)
			.orElseThrow(RoomNotFoundException::new);
		Long roomId = userTeamRoom.getTeamRoom().getId();
		String redisRoomId = redisTemplate.opsForValue().get(RedisKeys.userTeamRoom(user.getUserId()));
		String roomUsersKey = RedisKeys.TeamRoomUsers(Long.parseLong(Objects.requireNonNull(redisRoomId)));

		// Redis에서 유저 정보 삭제
		redisTemplate.execute(new SessionCallback<List<Object>>() {
			public List<Object> execute(RedisOperations operations) {
				operations.multi();

				// Redis 작업들
				operations.opsForList().remove(roomUsersKey, 0, user.getUserId().toString());
				operations.delete(RedisKeys.userTeamRoom(user.getUserId()));

				return operations.exec();
			}
		});

		// 음성 채팅 연결 종료
		voiceChatService.terminateUserVoiceConnection(roomId, user.getUserId().toString());

		// 남은 유저 정보 조회 및 팀별 그룹화
		Map<Long, List<UserInfoResponseDto>> remainingUsersByTeam = getRemainingTeamUsers(redisRoomId,
			user.getUserId());

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
			"GAME_FINISH_LEAVE",
			responseDto,
			BattleType.T
		);

		// 팀의 마지막 유저인 경우 음성 채팅 세션 종료
		List<String> remainingTeamUsers = redisTemplate.opsForList().range(roomUsersKey, 0, -1);
		if (remainingTeamUsers == null || remainingTeamUsers.isEmpty()) {
			voiceChatService.terminateTeamVoiceSession(Long.parseLong(redisRoomId));
			String opposingRoomId = matchId.replace(redisRoomId, "").replace("-", "");
			cleanupTeamGameRedisData(Long.parseLong(redisRoomId), Long.parseLong(opposingRoomId));
		}
	}

	// 개인전 중간 퇴장 처리
	private void handleInProgressSingleGameLeave(Game game, User user) {
		SingleRoom singleRoom = singleRoomRepository.findByUser_UserIdAndActivationIsTrue(user.getUserId()).
			orElseThrow(RoomNotFoundException::new);
		Long roomId = singleRoom.getId(); // dbRoomId
		String redisRoomId = redisTemplate.opsForValue().get(RedisKeys.userSingleRoom(user.getUserId()));

		// Redis에서 유저 정보 삭제
		String roomUsersKey = RedisKeys.SingleRoomUsers(Long.parseLong(Objects.requireNonNull(redisRoomId)));
		redisTemplate.execute(new SessionCallback<List<Object>>() {
			public List<Object> execute(RedisOperations operations) {
				operations.multi();

				// Redis 작업들
				operations.opsForList().remove(roomUsersKey, 0, user.getUserId().toString());
				operations.delete(RedisKeys.userSingleRoom(user.getUserId()));

				return operations.exec();
			}
		});

		// 남은 유저 정보 조회
		List<String> remainingUserIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);
		List<UserInfoResponseDto> remainingUsers = getRemainingUsers(remainingUserIds);

		// 퇴장한 유저의 결과를 FAIL로 설정
		singleRoom.updateStatusByGameLose(BattleResult.FAIL);

		// 퇴장 이벤트 전송
		SingleGameLeaveResponseDto responseDto = SingleGameLeaveResponseDto.of(
			game.getId(),
			roomId,
			UserInfoResponseDto.fromEntity(user),
			remainingUsers
		);

		roomWebSocketService.sendWebSocketMessage(
			redisRoomId,
			"GAME_LEAVE",
			responseDto,
			BattleType.S
		);

		// 모든 유저가 퇴장한 경우 게임 종료
		if (remainingUsers.isEmpty()) {
			game.cancelGame();

			Map<String, Object> gameEndPayload = Map.of(
				"gameId", game.getId(),
				"reason", "ALL_PLAYERS_LEFT"
			);

			roomWebSocketService.sendWebSocketMessage(
				redisRoomId,
				"GAME_END",
				gameEndPayload,
				BattleType.S
			);
			cleanupSingleGameRedisData(Long.parseLong(redisRoomId));
		}
	}

	// 팀전 퇴장 처리
	private void handleInProgressTeamGameLeave(Game game, User user) {
		UserTeamRoom userTeamRoom = userTeamRoomRepository.findByUser_UserIdAndTeamRoom_Game(user.getUserId(), game)
			.orElseThrow(RoomNotFoundException::new);
		Long roomId = userTeamRoom.getTeamRoom().getId();
		String redisRoomId = redisTemplate.opsForValue().get(RedisKeys.userTeamRoom(user.getUserId()));
		String roomUsersKey = RedisKeys.TeamRoomUsers(Long.parseLong(Objects.requireNonNull(redisRoomId)));

		// Redis에서 유저 정보 삭제
		redisTemplate.execute(new SessionCallback<List<Object>>() {
			public List<Object> execute(RedisOperations operations) {
				operations.multi();

				// Redis 작업들
				operations.opsForList().remove(roomUsersKey, 0, user.getUserId().toString());
				operations.delete(RedisKeys.userTeamRoom(user.getUserId()));

				return operations.exec();
			}
		});

		// 남은 유저 정보 조회 및 팀별 그룹화
		Map<Long, List<UserInfoResponseDto>> remainingUsersByTeam = getRemainingTeamUsers(redisRoomId,
			user.getUserId());

		// 음성 채팅 연결 종료
		voiceChatService.terminateUserVoiceConnection(roomId, user.getUserId().toString());

		// 퇴장 이벤트 전송
		TeamGameLeaveResponseDto responseDto = TeamGameLeaveResponseDto.of(
			game.getId(),
			roomId,
			UserInfoResponseDto.fromEntity(user),
			remainingUsersByTeam
		);

		String matchId = redisTemplate.opsForValue().get(RedisKeys.TeamMatchId(Long.parseLong(redisRoomId)));
		roomWebSocketService.sendWebSocketMessage(
			matchId,
			"GAME_LEAVE",
			responseDto,
			BattleType.T
		);

		// 한 팀이 전부 퇴장한 경우 게임 종료
		if (!remainingUsersByTeam.containsKey(roomId)) {
			game.cancelGame();

			// 남은 팀 승리 처리
			Long winningTeamId = remainingUsersByTeam.keySet().iterator().next();
			TeamRoom winningTeam = teamRoomRepository.findById(winningTeamId)
				.orElseThrow(RoomNotFoundException::new);
			winningTeam.updateStatusByGameClear(BattleResult.FIRST);

			// 퇴장한 팀 패배 처리
			TeamRoom losingTeam = teamRoomRepository.findById(roomId)
				.orElseThrow(RoomNotFoundException::new);
			losingTeam.updateStatusByGameLose(BattleResult.SECOND);

			teamRoomRepository.saveAll(Arrays.asList(winningTeam, losingTeam));

			// 게임 종료 이벤트 전송
			Map<String, Object> gameEndPayload = Map.of(
				"gameId", game.getId(),
				"reason", "ENEMY_ALL_LEFT",
				"winningTeamId", winningTeamId
			);

			roomWebSocketService.sendWebSocketMessage(
				matchId,
				"GAME_END",
				gameEndPayload,
				BattleType.T
			);

			// Redis 데이터 정리
			String opposingRoomId = matchId.replace(redisRoomId, "").replace("-", "");
			log.info("데이터 정리 내팀: {}", redisRoomId);
			log.info("데이터 정리 상대팀: {}", opposingRoomId);
			cleanupTeamGameRedisData(Long.parseLong(redisRoomId), Long.parseLong(opposingRoomId));

			// Voice 채팅 세션 종료
			voiceChatService.terminateTeamVoiceSession(Long.parseLong(redisRoomId));
			voiceChatService.terminateTeamVoiceSession(Long.parseLong(opposingRoomId));
		}
	}

	// 남은 유저 정보 조회
	private List<UserInfoResponseDto> getRemainingUsers(List<String> userIds) {
		if (userIds == null || userIds.isEmpty()) {
			return Collections.emptyList();
		}

		List<User> users = userRepository.findByUserIdIn(
			userIds.stream()
				.map(Long::parseLong)
				.collect(Collectors.toList())
		);

		return users.stream()
			.map(UserInfoResponseDto::fromEntity)
			.collect(Collectors.toList());
	}

	// 팀별 남은 유저 정보 조회
	private Map<Long, List<UserInfoResponseDto>> getRemainingTeamUsers(String redisRoomId, Long leftUserId) {
		Map<Long, List<UserInfoResponseDto>> remainingUsersByTeam = new HashMap<>();

		// matchId를 이용해 양쪽 팀의 roomId를 얻기
		String matchId = redisTemplate.opsForValue().get(RedisKeys.TeamMatchId(Long.parseLong(redisRoomId)));
		String[] roomIds = matchId.split("-");

		for (String roomId : roomIds) {
			Long teamRoomId = Long.parseLong(roomId);
			String roomUsersKey = RedisKeys.TeamRoomUsers(teamRoomId);
			String roomDbId = redisTemplate.opsForValue().get(RedisKeys.getRoomDbId(teamRoomId));
			List<String> userIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);

			if (userIds != null && !userIds.isEmpty()) {
				List<User> users = userRepository.findByUserIdIn(
					userIds.stream()
						.map(Long::parseLong)
						.filter(id -> !id.equals(leftUserId))
						.collect(Collectors.toList())
				);

				remainingUsersByTeam.put(Long.parseLong(Objects.requireNonNull(roomDbId)),
					users.stream()
						.map(UserInfoResponseDto::fromEntity)
						.collect(Collectors.toList())
				);
			}
		}

		return remainingUsersByTeam;
	}

	// Redis의 개인전 게임 데이터 정리
	private void cleanupSingleGameRedisData(Long roomId) {
		// 먼저 각 방의 유저 목록을 가져옴
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);

		List<String> userIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);

		// 모든 삭제할 키를 리스트에 추가
		List<String> keysToDelete = new ArrayList<>();

		// 기존 키들 추가
		keysToDelete.addAll(Arrays.asList(
			roomUsersKey,
			RedisKeys.SingleRoomStatus(roomId)
		));

		// 유저 키들 추가
		if (userIds != null) {
			userIds.forEach(userId -> keysToDelete.add(RedisKeys.userSingleRoom(Long.parseLong(userId))));
		}
		redisTemplate.delete(keysToDelete);
	}

	// Redis의 팀전 게임 데이터 정리
	private void cleanupTeamGameRedisData(Long roomId, Long opposingRoomId) {
		// 먼저 각 방의 유저 목록을 가져옴
		String roomUsersKey1 = RedisKeys.TeamRoomUsers(roomId);
		String roomUsersKey2 = RedisKeys.TeamRoomUsers(opposingRoomId);

		List<String> userIds1 = redisTemplate.opsForList().range(roomUsersKey1, 0, -1);
		List<String> userIds2 = redisTemplate.opsForList().range(roomUsersKey2, 0, -1);

		// 모든 삭제할 키를 리스트에 추가
		List<String> keysToDelete = new ArrayList<>();

		// 기존 키들 추가
		keysToDelete.addAll(Arrays.asList(
			roomUsersKey1,
			roomUsersKey2,
			RedisKeys.TeamRoomStatus(roomId),
			RedisKeys.TeamRoomStatus(opposingRoomId),
			RedisKeys.TeamMatchId(roomId),
			RedisKeys.TeamMatchId(opposingRoomId),
			RedisKeys.getRoomDbId(roomId),
			RedisKeys.getRoomDbId(opposingRoomId)
		));

		// 유저 키들 추가
		if (userIds1 != null) {
			userIds1.forEach(userId -> keysToDelete.add(RedisKeys.userTeamRoom(Long.parseLong(userId))));
		}
		if (userIds2 != null) {
			userIds2.forEach(userId -> keysToDelete.add(RedisKeys.userTeamRoom(Long.parseLong(userId))));
		}
		redisTemplate.delete(keysToDelete);
	}
}
