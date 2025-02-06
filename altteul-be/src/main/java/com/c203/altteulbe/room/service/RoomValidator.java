package com.c203.altteulbe.room.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.utils.RedisKeys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class RoomValidator {
	private final RedisTemplate<String, String> redisTemplate;

	// 유저가 방에 존재하는지 검증
	public boolean isUserInAnyRoom(Long userId, BattleType type) {
		String roomKey = switch (type) {
			case S -> RedisKeys.userSingleRoom(userId);
			case T -> RedisKeys.userTeamRoom(userId);
		};
		return Boolean.TRUE.equals(redisTemplate.hasKey(roomKey));
	}

	// 방 상태 검증
	public boolean isRoomWaiting(Long roomId, BattleType type) {
		String roomStatus = switch (type) {
			case S -> redisTemplate.opsForValue().get(RedisKeys.SingleRoomStatus(roomId));
			case T -> redisTemplate.opsForValue().get(RedisKeys.TeamRoomStatus(roomId));
		};
		return "waiting".equals(roomStatus);
	}

	// 방장 검증
	public boolean isRoomLeader(Long roomId, Long leaderId, BattleType type) {
		String roomUsersKey = switch (type) {
			case S -> RedisKeys.SingleRoomUsers(roomId);
			case T -> RedisKeys.TeamRoomUsers(roomId);
		};

		String savedLeaderId = redisTemplate.opsForList().index(roomUsersKey, 0);
		return savedLeaderId != null && savedLeaderId.equals(leaderId.toString());
	}

	// 최소 인원 검증
	public boolean isEnoughUsers(Long roomId, BattleType type) {
		String roomUsersKey = (type == BattleType.S) ? RedisKeys.SingleRoomUsers(roomId) : RedisKeys.TeamRoomUsers(roomId);
		Long userCount = redisTemplate.opsForList().size(roomUsersKey);

		return userCount != null && userCount >= type.getMinUsers() && userCount <= type.getMaxUsers();
	}
}
