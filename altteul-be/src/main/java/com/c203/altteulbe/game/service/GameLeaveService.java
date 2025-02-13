package com.c203.altteulbe.game.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
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
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRedisRepository;
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
	private final SingleRoomRedisRepository singleRoomRedisRepository;
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
		SingleRoom userRoom = singleRoomRepository.findByUser_UserId(user.getUserId())
			.orElseThrow(RoomNotFoundException::new);
		Long roomId = userRoom.getId();
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
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
			roomId.toString(),
			"GAME_FINISH_LEAVE",
			responseDto,
			BattleType.S
		);
	}

	// 팀전 정상 종료 후 나가기 처리
	private void handleFinishedTeamGameLeave(Game game, User user) {
		UserTeamRoom userTeamRoom = userTeamRoomRepository.findByUser_UserId(user.getUserId())
			.orElseThrow(RoomNotFoundException::new);
		Long roomId = userTeamRoom.getTeamRoom().getId();

		// Redis에서 유저 정보 삭제
		String roomUsersKey = RedisKeys.TeamRoomUsers(roomId);
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
		Map<Long, List<UserInfoResponseDto>> remainingUsersByTeam = getRemainingTeamUsers(game);

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
		if (remainingTeamUsers.isEmpty()) {
			voiceChatService.terminateTeamVoiceSession(roomId);
			String opposingRoomId = matchId.replace(roomId.toString(), "").replace("-", "");
			cleanupTeamGameRedisData(roomId, opposingRoomId);
		}
	}

	// 개인전 중간 퇴장 처리
	private void handleInProgressSingleGameLeave(Game game, User user) {
		SingleRoom userRoom = singleRoomRepository.findByUser_UserId(user.getUserId())
			.orElseThrow(RoomNotFoundException::new);
		Long roomId = userRoom.getId();

		// Redis에서 유저 정보 삭제
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
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
		userRoom.updateBattleResult(BattleResult.FAIL);
		singleRoomRepository.save(userRoom);

		// 퇴장 이벤트 전송
		SingleGameLeaveResponseDto responseDto = SingleGameLeaveResponseDto.of(
			game.getId(),
			roomId,
			UserInfoResponseDto.fromEntity(user),
			remainingUsers
		);

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
	private void handleInProgressTeamGameLeave(Game game, User user) {
		UserTeamRoom userTeamRoom = userTeamRoomRepository.findByUser_UserId(user.getUserId())
			.orElseThrow(RoomNotFoundException::new);
		Long roomId = userTeamRoom.getTeamRoom().getId();

		// Redis에서 유저 정보 삭제
		String roomUsersKey = RedisKeys.TeamRoomUsers(roomId);
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
				.orElseThrow(RoomNotFoundException::new);
			winningTeam.updateStatusByGameClear(BattleResult.FIRST);

			// 퇴장한 팀 패배 처리
			TeamRoom losingTeam = teamRoomRepository.findById(roomId)
				.orElseThrow(RoomNotFoundException::new);
			losingTeam.updateBattleResult(BattleResult.SECOND);

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
			String opposingRoomId = matchId.replace(roomId.toString(), "").replace("-", "");
			cleanupTeamGameRedisData(roomId, opposingRoomId);

			// Voice 채팅 세션 종료
			voiceChatService.terminateTeamVoiceSession(roomId);
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
	private Map<Long, List<UserInfoResponseDto>> getRemainingTeamUsers(Game game) {
		return game.getTeamRooms().stream()
			.collect(Collectors.toMap(
				TeamRoom::getId,
				room -> room.getUserTeamRooms().stream()
					.map(UserTeamRoom::getUser)
					.map(UserInfoResponseDto::fromEntity)
					.collect(Collectors.toList())
			));
	}

	// Redis의 개인전 게임 데이터 정리
	private void cleanupSingleGameRedisData(Long roomId) {
		redisTemplate.delete(RedisKeys.SingleRoomUsers(roomId));
		redisTemplate.delete(RedisKeys.SingleRoomStatus(roomId));
	}

	// Redis의 팀전 게임 데이터 정리
	private void cleanupTeamGameRedisData(Long roomId, String opposingRoomId) {
		redisTemplate.delete(RedisKeys.TeamRoomUsers(roomId));
		redisTemplate.delete(RedisKeys.TeamRoomUsers(Long.parseLong(opposingRoomId)));
		redisTemplate.delete(RedisKeys.TeamRoomStatus(roomId));
		redisTemplate.delete(RedisKeys.TeamRoomStatus(Long.parseLong(opposingRoomId)));
		redisTemplate.delete(RedisKeys.TeamMatchId(roomId));
		redisTemplate.delete(RedisKeys.TeamMatchId(Long.parseLong(opposingRoomId)));
	}
}
