package com.c203.altteulbe.room.service;

import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class SingleRoomCountingScheduler {
	private final RedisTemplate<String, String> redisTemplate;
	private final SingleRoomService singleRoomService;
	private final SingleRoomValidator singleRoomValidator;
	private final RoomWebSocketService roomWebSocketService;

	// 1초마다 실행
	@Scheduled(fixedRate = 1000)
	public void counting() {
		// Redis에서 개인전 방의 카운팅 키 조회
		Set<String> activeRooms = redisTemplate.keys("room:single:*:countdown");
		if (activeRooms == null || activeRooms.isEmpty()) return;

		for (String roomKey : activeRooms) {
			Long roomId = Long.parseLong(roomKey.split(":")[1]);
			Integer remainingTime = Integer.parseInt(redisTemplate.opsForValue().get(roomKey));

			// 카운팅이 0초가 되는 순간 키 삭제 후 게임 시작 처리
			if (remainingTime <= 0) {
				redisTemplate.delete(roomKey);
				singleRoomService.startGameAfterCountDown(roomId);
				continue;
			}

			// 인원 검증
			if (singleRoomValidator.isEnoughUsers(roomId)) {
				roomWebSocketService.sendWebSocketMessage(String.valueOf(roomId),"COUNTING_CANCEL", "최소 인원 수가 미달되었습니다.");
				redisTemplate.delete(roomKey);
				return;
			}
			redisTemplate.opsForValue().set(roomKey, String.valueOf(remainingTime-1));
			roomWebSocketService.sendWebSocketMessage(String.valueOf(roomId), "COUNTING", remainingTime);
		}
	}
}
