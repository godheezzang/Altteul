package com.c203.altteulbe.room.service.scheduler;

import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.c203.altteulbe.common.annotation.DistributedLock;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.room.service.TeamRoomService;
import com.c203.altteulbe.room.service.exception.MatchingProcessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class TeamMatchScheduler {
	private final RedisTemplate<String, String> redisTemplate;
	private final TeamRoomService teamRoomService;

	// 3초마다 실행
	@Scheduled(fixedDelay = 1000)
	public void scheduledProcessTeamMatching() {
		processTeamMatching();  // AOP 적용을 위해 별도 메소드로 호출
	}

	@DistributedLock(key = "team_match_lock", waitTime = 2, timeUnit = TimeUnit.SECONDS)
	public void processTeamMatching() {
		Set<String> matchingRoom = redisTemplate.opsForZSet().range(RedisKeys.TEAM_MATCHING_ROOMS, 0, 0);  // 제일 먼저 저장된 방
		if (matchingRoom == null || matchingRoom.isEmpty()) {
			return;
		}
		// 매칭 시작
		String roomId = matchingRoom.iterator().next();
		findOpponent(roomId);
	}

	private void findOpponent(String roomId) {
		try {
			Set<String> opponent = redisTemplate.opsForZSet().range(RedisKeys.TEAM_MATCHING_ROOMS, 1, -1);  // 가장 먼저 저장된 방을 제외한 나머지 방들
			if (opponent == null || opponent.isEmpty()) {
				log.info("팀 {}에 대한 매칭 상대가 없습니다.", roomId);
				return;
			}
			String opponentRoomId = opponent.iterator().next();
			log.info("매칭 완료 : {}, {}", roomId, opponentRoomId);
			teamRoomService.afterTeamMatch(roomId, opponentRoomId);
		} catch (Exception e) {
			throw new MatchingProcessException();
		}
	}
}