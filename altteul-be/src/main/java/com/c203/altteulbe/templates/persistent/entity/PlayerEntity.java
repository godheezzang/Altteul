package com.c203.altteulbe.templates.persistent.entity;

import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@RedisHash("player")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerEntity {
	@Id
	private String id;
	private String name;
	private String team;

	@Indexed
	private String status;
}
