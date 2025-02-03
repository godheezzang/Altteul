package com.c203.altteulbe.game.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.annotation.DistributedLock;
import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.common.response.WebSocketResponse;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.game.repository.SingleRoomRepository;
import com.c203.altteulbe.game.service.exception.DuplicateRoomEntryException;
import com.c203.altteulbe.game.service.exception.RoomNotFoundException;
import com.c203.altteulbe.game.service.exception.UserNotInRoomException;
import com.c203.altteulbe.game.web.dto.request.SingleRoomRequestDto;
import com.c203.altteulbe.game.web.dto.response.SingleRoomEnterResponseDto;
import com.c203.altteulbe.game.web.dto.response.SingleRoomLeaveResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.web.dto.response.UserInfoResponseDto;
import com.c203.altteulbe.websocket.exception.WebSocketMessageException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class SingleRoomService {
	private final RedisTemplate<String, String> redisTemplate;
	private final SimpMessagingTemplate messagingTemplate;
	private final UserJPARepository userJPARepository;

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
		if (isUserInAnyRoom(user.getUserId())) {
			throw new DuplicateRoomEntryException();
		}

		// 입장 가능한 대기방 조회
		Long existingRoomId = findAvailableRoom();

		// 입장 가능한 대기방이 있는 경우 유저 저장
		if (existingRoomId != null) {
			return addUserToExistingRoom(existingRoomId, user);
		}

		// 입장 가능한 대기방이 없는 경우 대기방 생성 후 유저 저장
		SingleRoomEnterResponseDto responseDto = createSingleRoom(user);

		// 웹소켓 메시지 브로드캐스트
		sendWebSocketMessage(responseDto.getRoomId().toString(), "ENTER", responseDto);
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
		Long roomId = getUserRoomId(userId);

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
		sendWebSocketMessage(roomId.toString(), "LEAVE", responseDto);
	}


	// 유저가 이미 다른 방에 속해있는지 확인
	private boolean isUserInAnyRoom(Long userId) {
		return Boolean.TRUE.equals(redisTemplate.hasKey(RedisKeys.userSingleRoom(userId)));
	}

	// 입장 가능한 대기방 조회
	private Long findAvailableRoom() {
		Set<String> roomIds = redisTemplate.opsForZSet().range(RedisKeys.SINGLE_WAITING_ROOMS, 0, 0);
		if (roomIds == null || roomIds.isEmpty()) {
			return null;
		}
		for (String roomId : roomIds) {
			String roomStatusKey = RedisKeys.SingleRoomStatus(Long.parseLong(roomId));  // 방 상태
			String roomUserKey = RedisKeys.SingleRoomUsers(Long.parseLong(roomId));     // 방에 존재하는 유저

			String status = redisTemplate.opsForValue().get(roomStatusKey);
			Long userCount = redisTemplate.opsForList().size(roomUserKey);

			if ("waiting".equals(status) && userCount != null && userCount<8) {
				return Long.parseLong(roomId);
			}
		}
		return null;
	}

	// 기존 대기방에 유저 추가
	private SingleRoomEnterResponseDto addUserToExistingRoom(Long roomId, User user) {
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);

		// Redis에 유저 추가
		redisTemplate.opsForList().rightPush(roomUsersKey, user.getUserId().toString());                  // 유저를 대기방에 추가 (방장 위임을 위해 순서 유지)
		redisTemplate.opsForValue().set(RedisKeys.userSingleRoom(user.getUserId()), roomId.toString());   // 유저가 속한 방 저장

		String leaderId = redisTemplate.opsForList().index(roomUsersKey, 0);              // 방장 검색
		List<String> userIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);  // 현재 방에 속한 모든 유저 정보 조회

		List<User> users = getUserByIds(userIds);
		List<UserInfoResponseDto> userDtos = UserInfoResponseDto.fromEntities(users);

		return SingleRoomEnterResponseDto.from(roomId, Long.parseLong(leaderId), userDtos);
	}

	// 개인전 대기방 생성
	private SingleRoomEnterResponseDto createSingleRoom(User user) {
		Long roomId = generateUniqueRoomId();  // Redis를 통해 id 생성

		String roomStatusKey = RedisKeys.SingleRoomStatus(roomId);
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);

		redisTemplate.opsForValue().set(roomStatusKey, "waiting");     // 대기 중 상태로 방 저장
		redisTemplate.opsForList().rightPush(roomUsersKey, user.getUserId().toString());
		redisTemplate.opsForZSet().add(RedisKeys.SINGLE_WAITING_ROOMS, roomId.toString(), System.currentTimeMillis());  // 생성된 순서로 대기방 저장
		redisTemplate.opsForValue().set(RedisKeys.userSingleRoom(user.getUserId()), roomId.toString());

		List<UserInfoResponseDto> users = List.of(UserInfoResponseDto.fromEntity(user));   // List로 변환
		return SingleRoomEnterResponseDto.from(roomId, user.getUserId(), users);
	}

	// 유저가 속한 방 조회
	private Long getUserRoomId(Long userId) {
		String roomIdStr = redisTemplate.opsForValue().get(RedisKeys.userSingleRoom(userId));
		if (roomIdStr == null) {
			throw new UserNotInRoomException();
		}
		return Long.parseLong(roomIdStr);
	}

	// userId 리스트로 User 엔티티 조회
	private List<User> getUserByIds(List<String> userIds) {
		return userJPARepository.findByUserIdIn(
			userIds.stream().map(Long::parseLong).collect(Collectors.toList())
		);
	}

	// single_room_id 생성 (게임이 시작하는 시점에 game_id 값으로 DB에 저장됨)
	private Long generateUniqueRoomId() {
		return redisTemplate.opsForValue().increment(RedisKeys.ROOM_ID_COUNTER, 1);
	}

	// WebSocket 메시지 브로드캐스트
	private <T> void sendWebSocketMessage(String roomId, String eventType, T responseDto) {
		try {
			messagingTemplate.convertAndSend("/sub/single/room/" + roomId,
				new WebSocketResponse<>(eventType, responseDto));
		} catch (Exception e) {
			log.error("WebSocket 메시지 전송 실패 (eventType: {}, roomId: {}): {}", eventType, roomId, e.getMessage());
			throw new WebSocketMessageException();
		}
	}
}
