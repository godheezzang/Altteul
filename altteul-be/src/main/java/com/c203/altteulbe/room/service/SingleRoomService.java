package com.c203.altteulbe.room.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.room.service.exception.CannotLeaveRoomException;
import com.c203.altteulbe.room.service.exception.UserNotInRoomException;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.entity.Problem;
import com.c203.altteulbe.game.persistent.entity.Testcase;
import com.c203.altteulbe.game.persistent.repository.game.GameJPARepository;
import com.c203.altteulbe.game.persistent.repository.problem.ProblemRepository;
import com.c203.altteulbe.game.persistent.repository.testcase.TestcaseRepository;
import com.c203.altteulbe.game.service.exception.GameCannotStartException;
import com.c203.altteulbe.game.service.exception.NotEnoughUserException;
import com.c203.altteulbe.game.service.exception.ProblemNotFoundException;
import com.c203.altteulbe.game.web.dto.response.GameStartForProblemDto;
import com.c203.altteulbe.game.web.dto.response.GameStartForTestcaseDto;
import com.c203.altteulbe.room.persistent.entity.SingleRoom;
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRedisRepository;
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRepository;
import com.c203.altteulbe.room.service.exception.DuplicateRoomEntryException;
import com.c203.altteulbe.room.service.exception.NotRoomLeaderException;
import com.c203.altteulbe.room.web.dto.request.RoomGameStartRequestDto;
import com.c203.altteulbe.room.web.dto.request.RoomRequestDto;
import com.c203.altteulbe.room.web.dto.response.SingleRoomGameStartForUserInfoResponseDto;
import com.c203.altteulbe.room.web.dto.response.RoomEnterResponseDto;
import com.c203.altteulbe.room.web.dto.response.SingleRoomGameStartResponseDto;
import com.c203.altteulbe.room.web.dto.response.RoomLeaveResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;
import com.c203.altteulbe.user.web.dto.response.UserInfoResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class SingleRoomService {
	private final RedisTemplate<String, String> redisTemplate;
	private final UserJPARepository userJPARepository;
	private final RoomValidator validator;
	private final RoomWebSocketService roomWebSocketService;
	private final SingleRoomRedisRepository singleRoomRedisRepository;
	private final SingleRoomRepository singleRoomRepository;
	private final ProblemRepository problemRepository;
	private final TestcaseRepository testcaseRepository;
	private final GameJPARepository gameRepository;

	/*
	 * 개인전 대기방 입장 처리
	 * 동일 유저의 중복 요청 방지 및 동시성 제어를 위해 userId를 키로 갖는 락을 생성
	 */
	//@DistributedLock(key="#requestDto.userId")
	public RoomEnterResponseDto enterSingleRoom(RoomRequestDto requestDto) {
		User user = userJPARepository.findByUserId(requestDto.getUserId())
								  .orElseThrow(()->new NotFoundUserException());

		// 유저가 이미 방에 존재하는지 검증
		if (validator.isUserInAnyRoom(user.getUserId(), BattleType.S)) {
			log.info("이미 방에 존재하는 유저가 중복으로 방 입장 요청 : userId = {}", requestDto.getUserId());
			throw new DuplicateRoomEntryException();
		}
		if (validator.isUserInAnyRoom(user.getUserId(), BattleType.T)) {
			log.info("이미 방에 존재하는 유저가 중복으로 방 입장 요청 : userId = {}", requestDto.getUserId());
			throw new DuplicateRoomEntryException();
		}

		// 입장 가능한 대기방 조회
		Long existingRoomId = singleRoomRedisRepository.getAvailableRoom();

		// 입장 가능한 대기방이 있는 경우 유저 저장 (API 응답 + WebSocket 전송)
		if (existingRoomId != null) {
			RoomEnterResponseDto responseDto = singleRoomRedisRepository.insertUserToExistingRoom(existingRoomId, user);

			// 웹소켓 메시지 브로드캐스트
			roomWebSocketService.sendWebSocketMessage(responseDto.getRoomId().toString(), "ENTER", responseDto, BattleType.S);
			return responseDto;
		}

		// 입장 가능한 대기방이 없는 경우 대기방 생성 후 유저 저장 (API 응답)
		RoomEnterResponseDto responseDto = singleRoomRedisRepository.createRedisSingleRoom(user);
		return responseDto;
	}

	/**
	 * 개인전 대기방 퇴장 처리
	 */
	//@DistributedLock(key = "#requestDto.userId")
	public void leaveSingleRoom(RoomRequestDto requestDto) {
		Long userId = requestDto.getUserId();

		// 유저가 속한 방 조회
		Long roomId = singleRoomRedisRepository.getRoomIdByUser(userId);
		if (roomId == null) {
			throw new UserNotInRoomException();
		}

		// 퇴장하는 유저 정보 조회
		User user = userJPARepository.findByUserId(userId)
						.orElseThrow(()->new NotFoundUserException());

		UserInfoResponseDto leftUserDto = UserInfoResponseDto.fromEntity(user);

		// 방 상태 확인
		String roomStatusKey = RedisKeys.SingleRoomStatus(roomId);
		String status = redisTemplate.opsForValue().get(roomStatusKey);

		if (!"waiting".equals(status)) {
			throw new CannotLeaveRoomException();
		}

		// Redis에서 퇴장하는 유저 삭제
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
		redisTemplate.opsForList().remove(roomUsersKey, 0, userId.toString());
		redisTemplate.delete(RedisKeys.userSingleRoom(userId));

		// 퇴장 후 방에 남은 유저가 없는 경우 관련 데이터 삭제
		List<String> remainingUserIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);
		if (remainingUserIds == null || remainingUserIds.isEmpty()) {
			log.info("모든 유저들이 퇴장한 개인전 방의 데이터 삭제");
			singleRoomRedisRepository.deleteRedisSingleRoom(roomId);
			return;
		}

		// 방장 조회
		Long leaderId = Long.parseLong(remainingUserIds.get(0));

		// 남은 유저들 정보 반환
		List<User> remainingUsers = getUserByIds(remainingUserIds);
		List<UserInfoResponseDto> remainingUserDtos = UserInfoResponseDto.fromEntities(remainingUsers);

		RoomLeaveResponseDto responseDto = RoomLeaveResponseDto.toResponse(
			roomId, leaderId, leftUserDto, remainingUserDtos
		);
		// WebSocket 메시지 브로드캐스트
		roomWebSocketService.sendWebSocketMessage(roomId.toString(), "LEAVE", responseDto, BattleType.S);
	}

	/**
	 * 개인전 게임 시작 전 카운트다운 처리
	 */
	//@DistributedLock(key = "requestDto.roomId")
	public void startGame(RoomGameStartRequestDto requestDto) {
		Long roomId = requestDto.getRoomId();
		Long leaderId = requestDto.getLeaderId();

		// 검증
		if (!validator.isRoomWaiting(roomId, BattleType.S)) throw new GameCannotStartException();
		if (!validator.isRoomLeader(roomId, leaderId, BattleType.S)) throw new NotRoomLeaderException();
		if (!validator.isEnoughUsers(roomId, BattleType.S)) throw new NotEnoughUserException();

		// 방 상태 변경 (waiting → counting)
		redisTemplate.opsForZSet().remove(RedisKeys.SINGLE_WAITING_ROOMS, roomId.toString());
		redisTemplate.opsForValue().set(RedisKeys.SingleRoomStatus(roomId), "counting");

		// 카운트다운 시작 → Scheduler가 인식
		redisTemplate.opsForValue().set(RedisKeys.SingleRoomCountdown(roomId), "5");
	}

	/**
	 * 개인전 게임 시작 처리
	 */
	@Transactional
	public void startGameAfterCountDown(Long roomId) {
		// 최소 인원 수 검증
		if (!validator.isEnoughUsers(roomId, BattleType.S)) {
			roomWebSocketService.sendWebSocketMessage(String.valueOf(roomId), "COUNTING_CANCEL", "최소 인원 수가 미달되었습니다.", BattleType.S);
			return;
		}

		// 문제 및 테스트케이스 조회
		List<Long> problemIds = problemRepository.findAllProblemIds();
		if (problemIds.isEmpty()) {
			throw new ProblemNotFoundException();
		}
		Long randomProblemId = problemIds.get(new Random().nextInt(problemIds.size()));
		Problem problemEntity = problemRepository.findById(randomProblemId)
			.orElseThrow(ProblemNotFoundException::new);

		List<Testcase> testcaseEntities = testcaseRepository.findTestcasesByProblemId(problemEntity.getId());

		// DB에 Game 저장
		Game game = Game.create(problemEntity, BattleType.S);
		gameRepository.save(game);

		// Redis에서 현재 방의 유저 목록 가져오기
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
		List<String> userIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);

		Long leaderId = Long.parseLong(userIds.get(0));

		// User 엔티티 조회 및 Map으로 변환
		Map<Long, User> userMap = getUserByIds(userIds).stream()
			.collect(Collectors.toMap(User::getUserId, user -> user));

		// SingleRoom 객체 생성 후 저장
		List<SingleRoom> singleRooms = new ArrayList<>();
		Map<Long, Long> userRoomIdMap = new HashMap<>(); // userId → singleRoomId 매핑

		for (int i = 0; i < userIds.size(); i++) {
			Long userId = Long.parseLong(userIds.get(i));
			User user = userMap.get(userId);

			if (user != null) {
				SingleRoom singleRoom = SingleRoom.create(game, user, i);
				singleRooms.add(singleRoom);
			}
		}
		singleRoomRepository.saveAll(singleRooms);

		// SingleRoom의 PK 매핑
		for (SingleRoom singleRoom : singleRooms) {
			userRoomIdMap.put(singleRoom.getUser().getUserId(), singleRoom.getId());
		}

		// 방 상태를 gaming으로 변경
		redisTemplate.opsForValue().set(RedisKeys.SingleRoomStatus(roomId), "gaming");

		// WebSocket으로 게임 시작 데이터 전송
		List<SingleRoomGameStartForUserInfoResponseDto> users = userMap.values().stream()
			.map(user -> SingleRoomGameStartForUserInfoResponseDto.fromEntity(user, userRoomIdMap.get(user.getUserId()))) // SingleRoom의 pk를 roomId로 설정
			.collect(Collectors.toList());

		List<GameStartForTestcaseDto> testcase = testcaseEntities.stream()
			.map(GameStartForTestcaseDto::from)
			.collect(Collectors.toList());

		GameStartForProblemDto problem = GameStartForProblemDto.from(problemEntity);

		SingleRoomGameStartResponseDto responseDto = SingleRoomGameStartResponseDto.from(
			game.getId(), leaderId, users, problem, testcase
		);

		roomWebSocketService.sendWebSocketMessage(String.valueOf(roomId), "GAME_START", responseDto, BattleType.S);
	}


	// userId 리스트로 User 엔티티 조회
	private List<User> getUserByIds(List<String> userIds) {
		return userJPARepository.findByUserIdIn(
			userIds.stream().map(Long::parseLong).collect(Collectors.toList())
		);
	}
}
