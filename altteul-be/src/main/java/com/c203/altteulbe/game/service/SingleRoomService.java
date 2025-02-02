package com.c203.altteulbe.game.service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.annotation.DistributedLock;
import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.game.persistent.entity.SingleRoom;
import com.c203.altteulbe.game.repository.SingleRoomRepository;
import com.c203.altteulbe.game.service.exception.DuplicateRoomEntryException;
import com.c203.altteulbe.game.web.dto.request.SingleRoomEnterRequestDto;
import com.c203.altteulbe.game.web.dto.response.SingleRoomEnterResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.persistent.repository.UserRepository;
import com.c203.altteulbe.user.web.dto.response.UserInfoResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SingleRoomService {
	private final RedisTemplate<String, String> redisTemplate;
	private final SingleRoomRepository singleRoomRepository;
	//private final UserRepository userRepository;
	private final UserJPARepository userJPARepository;

	/*
	 * 개인전 대기방 입장 처리
	 * 동일 유저의 중복 요청 방지 및 동시성 제어를 위해 userId를 키로 갖는 락을 생성
	 */
	@DistributedLock(key="#userId")
	@Transactional
	public SingleRoomEnterResponseDto enterSingleRoom(SingleRoomEnterRequestDto requestDto) {
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
		return createSingleRoom(user);
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

		redisTemplate.opsForList().rightPush(roomUsersKey, user.getUserId().toString());                  // 유저를 대기방에 추가 (방장 위임을 위해 순서 유지)
		redisTemplate.opsForValue().set(RedisKeys.userSingleRoom(user.getUserId()), roomId.toString());   // 유저가 속한 방 저장

		String leaderId = redisTemplate.opsForList().index(roomUsersKey, 0);              // 방장 검색
		List<String> userIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);  // 현재 방에 속한 모든 유저 정보 조회

		List<User> users = userJPARepository.findByUserIdIn(
			userIds.stream().map(Long::parseLong).collect(Collectors.toList())
		);
		List<UserInfoResponseDto> userDtos = UserInfoResponseDto.fromEntities(users);
		return SingleRoomEnterResponseDto.from(roomId, Long.parseLong(leaderId), userDtos);
	}

	// 개인전 대기방 생성
	private SingleRoomEnterResponseDto createSingleRoom(User user) {
		SingleRoom singleRoom = SingleRoom.create(user);
		singleRoom = singleRoomRepository.save(singleRoom);
		Long roomId = singleRoom.getId();

		String roomStatusKey = RedisKeys.SingleRoomStatus(roomId);
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);

		redisTemplate.opsForValue().set(roomStatusKey, "waiting");     // 대기 중 상태로 방 저장
		redisTemplate.opsForList().rightPush(roomUsersKey, user.getUserId().toString());
		redisTemplate.opsForZSet().add(RedisKeys.SINGLE_WAITING_ROOMS, roomId.toString(), System.currentTimeMillis());  // 생성된 순서로 대기방 저장
		redisTemplate.opsForValue().set(RedisKeys.userSingleRoom(user.getUserId()), roomId.toString());

		List<UserInfoResponseDto> users = List.of(UserInfoResponseDto.fromEntity(user));   // List로 변환
		return SingleRoomEnterResponseDto.from(roomId, user.getUserId(), users);
	}

}
