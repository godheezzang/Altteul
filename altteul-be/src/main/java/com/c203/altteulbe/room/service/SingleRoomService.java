package com.c203.altteulbe.room.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.annotation.DistributedLock;
import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.exception.BusinessException;
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
import com.c203.altteulbe.room.persistent.repository.SingleRoomRedisRepository;
import com.c203.altteulbe.room.persistent.repository.SingleRoomRepository;
import com.c203.altteulbe.room.service.exception.DuplicateRoomEntryException;
import com.c203.altteulbe.room.service.exception.NotRoomLeaderException;
import com.c203.altteulbe.room.service.exception.RoomNotFoundException;
import com.c203.altteulbe.room.web.dto.request.SingleRoomGameStartRequestDto;
import com.c203.altteulbe.room.web.dto.request.SingleRoomRequestDto;
import com.c203.altteulbe.room.web.dto.response.SingleRoomEnterResponseDto;
import com.c203.altteulbe.room.web.dto.response.SingleRoomGameStartResponseDto;
import com.c203.altteulbe.room.web.dto.response.SingleRoomLeaveResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.web.dto.response.UserInfoResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class SingleRoomService {
	private final RedisTemplate<String, String> redisTemplate;
	private final UserJPARepository userJPARepository;
	private final SingleRoomValidator singleRoomValidator;
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
	@DistributedLock(key="#requestDto.userId")
	@Transactional
	public SingleRoomEnterResponseDto enterSingleRoom(SingleRoomRequestDto requestDto) {
		User user = userJPARepository.findByUserId(requestDto.getUserId())
								  .orElseThrow(()->new BusinessException("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND)); // 향후 예외 클래스 교체 예정

		// 유저가 이미 방에 존재하는지 검증
		if (singleRoomValidator.isUserInAnyRoom(user.getUserId())) {
			throw new DuplicateRoomEntryException();
		}

		// 입장 가능한 대기방 조회
		Long existingRoomId = singleRoomRedisRepository.findAvailableRoom();

		// 입장 가능한 대기방이 있는 경우 유저 저장
		if (existingRoomId != null) {
			return singleRoomRedisRepository.addUserToExistingRoom(existingRoomId, user);
		}

		// 입장 가능한 대기방이 없는 경우 대기방 생성 후 유저 저장
		SingleRoomEnterResponseDto responseDto = singleRoomRedisRepository.createRedisSingleRoom(user);

		// 웹소켓 메시지 브로드캐스트
		roomWebSocketService.sendWebSocketMessage(responseDto.getRoomId().toString(), "ENTER", responseDto);
		return responseDto;
	}

	/**
	 * 개인전 대기방 퇴장 처리
	 */
	@DistributedLock(key = "#requestDto.userId")
	@Transactional
	public void leaveSingleRoom(SingleRoomRequestDto requestDto) {
		Long userId = requestDto.getUserId();

		// 유저가 속한 방 조회
		Long roomId = singleRoomRedisRepository.getUserRoomId(userId);

		// 현재 방에 존재하는 유저들 조회
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
		List<String> userIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);

		if (userIds == null || userIds.isEmpty()) {
			throw new RoomNotFoundException();
		}

		// 퇴장하는 유저 정보 조회
		User user = userJPARepository.findByUserId(userId)
						.orElseThrow(()->new BusinessException("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND));

		UserInfoResponseDto leftUserDto = UserInfoResponseDto.fromEntity(user);

		// Redis에서 퇴장하는 유저 삭제
		redisTemplate.opsForList().remove(roomUsersKey, 0, userId.toString());
		redisTemplate.delete(RedisKeys.userSingleRoom(userId));

		// 방에 남은 유저 수 확인
		List<String> remainingUserIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);

		if (remainingUserIds == null || remainingUserIds.isEmpty()) {
			redisTemplate.delete(roomUsersKey);
			redisTemplate.delete(RedisKeys.SingleRoomStatus(roomId));
			redisTemplate.opsForZSet().remove(RedisKeys.SINGLE_WAITING_ROOMS, Long.toString(roomId));
			return;
		}

		// 방장 조회
		Long leaderId = Long.parseLong(remainingUserIds.get(0));

		// 남은 유저들 정보 반환
		List<User> remainingUsers = getUserByIds(remainingUserIds);
		List<UserInfoResponseDto> remainingUserDtos = UserInfoResponseDto.fromEntities(remainingUsers);

		SingleRoomLeaveResponseDto responseDto = SingleRoomLeaveResponseDto.toResponse(
			roomId, leaderId, leftUserDto, remainingUserDtos
		);
		// WebSocket 메시지 브로드캐스트
		roomWebSocketService.sendWebSocketMessage(roomId.toString(), "LEAVE", responseDto);
	}

	/**
	 * 개인전 게임 시작 전 카운트다운 처리
	 */
	@Transactional
	@DistributedLock(key = "requestDto.roomId")
	public void startGame(SingleRoomGameStartRequestDto requestDto) {
		Long roomId = requestDto.getRoomId();
		Long leaderId = requestDto.getLeaderId();

		// 검증
		if (!singleRoomValidator.isRoomWaiting(roomId)) throw new GameCannotStartException();
		if (!singleRoomValidator.isRoomLeader(roomId, leaderId)) throw new NotRoomLeaderException();
		if (!singleRoomValidator.isEnoughUsers(roomId)) throw new NotEnoughUserException();

		// 방 상태 변경
		redisTemplate.opsForValue().set(RedisKeys.SingleRoomStatus(roomId), "counting");

		// 카운트다운 시작
		redisTemplate.opsForValue().set(RedisKeys.SingleRoomCountdown(roomId), "5");
	}

	/**
	 * 개인전 게임 시작 처리
	 */
	@Transactional
	public void startGameAfterCountDown(Long roomId) {
		// 최소 인원 수 검증
		if (!singleRoomValidator.isEnoughUsers(roomId)) {
			roomWebSocketService.sendWebSocketMessage(String.valueOf(roomId),"COUNTING_CANCEL", "최소 인원 수가 미달되었습니다.");
			return;
		}

		// 문제 및 테스트케이스 조회
		Problem problemEntity = problemRepository.findRandomProblem()
			                               .orElseThrow(()-> new ProblemNotFoundException());

		List<Testcase> testcaseEntities = testcaseRepository.findTestcasesByProblemId(problemEntity.getId());

		// DB에 Game 저장
		Game game = Game.create(roomId, problemEntity, BattleType.S);
		gameRepository.save(game);

		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
		List<String> userIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);

		if (userIds == null || userIds.isEmpty()) {
			roomWebSocketService.sendWebSocketMessage(String.valueOf(roomId), "COUNTING_CANCEL", "최소 인원 수가 미달되었습니다.");
			return;
		}
		Long leaderId = Long.parseLong(userIds.get(0));

		// [1] DB에 SingleRoom 저장 : 입장 순서 유지를 위해 userId List를 User List로 변환 후 Map으로 저장
		Map<Long, User> userMap = getUserByIds(userIds).stream()
						.collect(Collectors.toMap(User::getUserId, user -> user));

		// [2] DB에 SingleRoom 저장 : SingleRoom 생성 후 DB에 저장
		List<SingleRoom> singleRooms = new ArrayList<>();
		for (int i=0; i<userIds.size(); i++) {
			Long userId = Long.parseLong(userIds.get(i));
			User user = userMap.get(userId);

			if (user != null) {
				SingleRoom singleRoom = SingleRoom.create(game, user, i);
				singleRooms.add(singleRoom);
			}
		}
		singleRoomRepository.saveAll(singleRooms);

		// 방 상태를 gaming으로 변경
		redisTemplate.opsForValue().set(RedisKeys.SingleRoomStatus(roomId), "gaming");

		// WebSocket으로 게임 시작 데이터 전송
		List<User> userEntities = getUserByIds(userIds);
		List<GameStartForTestcaseDto> testcase = testcaseEntities.stream()
													.map(GameStartForTestcaseDto::from)
													.collect(Collectors.toList());

		List<UserInfoResponseDto> users = UserInfoResponseDto.fromEntities(userEntities);
		GameStartForProblemDto problem = GameStartForProblemDto.from(problemEntity);

		SingleRoomGameStartResponseDto responseDto = SingleRoomGameStartResponseDto.from(
			game.getId(),leaderId, users, problem, testcase
		);

		roomWebSocketService.sendWebSocketMessage(String.valueOf(roomId), "GAME_START", responseDto);
	}

	// userId 리스트로 User 엔티티 조회
	private List<User> getUserByIds(List<String> userIds) {
		return userJPARepository.findByUserIdIn(
			userIds.stream().map(Long::parseLong).collect(Collectors.toList())
		);
	}
}
