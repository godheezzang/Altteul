package com.c203.altteulbe.templates.persistent.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Reference;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * RedisHash
 * - value : game이라는 클러스터에서 id이라는 key를 갖고 있는 value을 찾음
 * - timeout : timeToLive option
 */
@RedisHash("game")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameEntity {
	@Id
	private String id;
	private String name;
	private GameStatus status;

	@Reference
	private List<PlayerEntity> players;
	private Map<String, Integer> scores;
	private LocalDateTime startTime;

	@TimeToLive
	private Long timeToLive;  // TTL in seconds

	@Indexed
	private String gameType;  // 인덱싱이 필요한 필드
}