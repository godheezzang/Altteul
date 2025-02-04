package com.c203.altteulbe.room.service;

import java.util.List;
import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.c203.altteulbe.room.persistent.repository.SingleRoomRedisRepository;
import com.c203.altteulbe.room.utils.RedisKeys;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class SingleRoomCountingScheduler {
	private final RedisTemplate<String, String> redisTemplate;
	private final SingleRoomService singleRoomService;
	private final SingleRoomRedisRepository singleRoomRedisRepository;
	private final SingleRoomValidator singleRoomValidator;
	private final RoomWebSocketService roomWebSocketService;

	// 1초마다 실행
	@Scheduled(fixedRate = 1000)
	public void counting() {

		// Redis에서 개인전 방의 카운팅 키 조회
		Set<String> activeRooms = redisTemplate.keys("room:single:*:countdown");
		if (activeRooms == null || activeRooms.isEmpty()) {
			return;
		}

		// 카운팅해야 하는 개인전 방 탐색
		for (String roomKey : activeRooms) {
			Long roomId = Long.parseLong(roomKey.split(":")[2]);
			Integer remainingTime = Integer.parseInt(redisTemplate.opsForValue().get(roomKey));

			// Redis에서 현재 방에 남아있는 유저 조회
			String roomUsersKey = RedisKeys.SingleRoomUsers(roomId);
			List<String> userIds = redisTemplate.opsForList().range(roomUsersKey, 0, -1);

			// 카운팅 중 모든 유저가 퇴장한 경우 해당 방과 관련된 redis 데이터 삭제
			if (userIds == null || userIds.isEmpty()) {
				log.info("[Scheduler] 카운팅 중 모든 유저들 퇴장 : roomId : {}", roomId);
				redisTemplate.delete(roomKey);
				singleRoomRedisRepository.deleteRedisSingleRoom(roomId);
				continue;
			}

			// 인원 검증 : 방을 이전 상태로 되돌릴 것이라고 가정하고 구현했기 때문에 관련 redis key는 카운팅만 제거
			if (!singleRoomValidator.isEnoughUsers(roomId)) {
				log.info("[Scheduler] 카운팅 중 최소 인원 미달 : roomId : {}", roomId);
				roomWebSocketService.sendWebSocketMessage(String.valueOf(roomId),"COUNTING_CANCEL", "인원 수가 부족합니다.");
				redisTemplate.delete(roomKey);
				continue;
			}

			// 카운팅이 마이너스가 되는 순간 카운팅 키 삭제 후 게임 시작 처리
			if (remainingTime < 0) {
				log.info("[Scheduler] 카운팅 정상 완료 : roomId : {}", roomId);
				redisTemplate.delete(roomKey);
				singleRoomService.startGameAfterCountDown(roomId);
				continue;
			}

			roomWebSocketService.sendWebSocketMessage(String.valueOf(roomId), "COUNTING", remainingTime);
			redisTemplate.opsForValue().set(roomKey, String.valueOf(remainingTime-1));
		}
	}
}
