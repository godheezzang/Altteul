package com.c203.altteulbe.room.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.utils.RedisKeys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RoomValidator {
	private final RedisTemplate<String, String> redisTemplate;

	// 유저가 방에 존재하는지 검증
	public boolean isUserInAnyRoom(Long userId, BattleType type) {
		if (type == BattleType.S) {
			return Boolean.TRUE.equals(redisTemplate.hasKey(RedisKeys.userSingleRoom(userId)));
		}
		if (type == BattleType.T) {
			return Boolean.TRUE.equals(redisTemplate.hasKey(RedisKeys.userTeamRoom(userId)));
		}
		return false;
	}

	// 방 상태 검증
	public boolean isRoomWaiting(Long roomId, BattleType type) {
		String roomStatus = null;
		if (type == BattleType.S) {
			roomStatus = redisTemplate.opsForValue().get(RedisKeys.SingleRoomStatus(roomId));
		}
		if (type == BattleType.T) {
			roomStatus = redisTemplate.opsForValue().get(RedisKeys.TeamRoomStatus(roomId));
		}
		return "waiting".equals(roomStatus);
	}

	// 방장 검증
	public boolean isRoomLeader(Long roomId, Long leaderId, BattleType type) {
		String roomUsersKey = null;

		if (type == BattleType.S) {
			roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
		}
		if (type == BattleType.T) {
			roomUsersKey = RedisKeys.TeamRoomUsers(roomId);
		}

		String savedLeaderId = redisTemplate.opsForList().index(roomUsersKey, 0);
		return savedLeaderId != null && savedLeaderId.equals(leaderId.toString());
	}

	// 최소 인원 검증
	public boolean isEnoughUsers(Long roomId, BattleType type) {
		String roomUsersKey =
			(type == BattleType.S) ? RedisKeys.SingleRoomUsers(roomId) : RedisKeys.TeamRoomUsers(roomId);
		Long userCount = redisTemplate.opsForList().size(roomUsersKey);

		int minUsers = 2;
		int maxUsers = (type == BattleType.S) ? 8 : 4;

		return userCount != null && userCount >= minUsers && userCount <= maxUsers;
	}
}
