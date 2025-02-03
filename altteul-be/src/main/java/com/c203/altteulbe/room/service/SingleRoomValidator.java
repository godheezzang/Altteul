package com.c203.altteulbe.room.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import com.c203.altteulbe.room.utils.RedisKeys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SingleRoomValidator {
	private final RedisTemplate<String, String> redisTemplate;

	// 유저가 방에 존재하는지 검증
	public boolean isUserInAnyRoom(Long userId) {
		return Boolean.TRUE.equals(redisTemplate.hasKey(RedisKeys.userSingleRoom(userId)));
	}

	// 방 상태 검증
	public boolean isRoomWaiting(Long roomId) {
		String roomStatus = redisTemplate.opsForValue().get(RedisKeys.SingleRoomStatus(roomId));
		return "waiting".equals(roomStatus);
	}

	// 방장 검증
	public boolean isRoomLeader(Long roomId, Long leaderId) {
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
		String savedLeaderId = redisTemplate.opsForList().index(roomUsersKey, 0);
		return savedLeaderId != null && savedLeaderId.equals(leaderId.toString());
	}

	// 최소 인원 검증
	public boolean isEnoughUsers(Long roomId) {
		String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
		Long userCount = redisTemplate.opsForList().size(roomUsersKey);
		return userCount != null && userCount >= 2 && userCount <= 8;
	}
}
