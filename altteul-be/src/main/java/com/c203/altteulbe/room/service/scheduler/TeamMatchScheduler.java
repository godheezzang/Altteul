package com.c203.altteulbe.room.service.scheduler;

import java.util.Set;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
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
	@Scheduled(fixedRate = 3000)
	public void processTeamMatching() {
		Set<String> matchingRoom = redisTemplate.opsForZSet().range(RedisKeys.TEAM_MATCHING_ROOMS, 0, 0);
		if (matchingRoom == null || matchingRoom.isEmpty()) {
			return;
		}
		// 매칭 시작
		String roomId = matchingRoom.iterator().next();
		findOpponent(Long.valueOf(roomId));
	}

	private void findOpponent(Long roomId) {
		try {
			// 상대 팀 탐색
			Set<String> opponent = redisTemplate.opsForZSet().range(RedisKeys.TEAM_MATCHING_ROOMS, 1, -1);
			if (opponent == null || opponent.isEmpty()) {
				log.info("팀 {}에 대한 매칭 상대가 없습니다.", roomId);
				return;
			}
			// 매칭 가능한 팀 선택
			String opponentRoomId = opponent.iterator().next();

			// 두 팀을 매칭
			teamRoomService.matchRooms(roomId, Long.valueOf(opponentRoomId));
		} catch (Exception e) {
			throw new MatchingProcessException();
		}
	}
}