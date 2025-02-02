package com.c203.altteulbe.common.utils;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RedisUtils {
	private static final String FRIEND_RELATION_CACHE = "friendRelation";
	private final RedisTemplate<String, String> redisTemplate;

	@PostConstruct
	public void init() {
		redisTemplate.setEnableTransactionSupport(true);
	}

	// 친구 관계 저장 (양방향)
	@Transactional
	public void setFriendRelation(Long userId1, Long userId2) {
		redisTemplate.execute(new SessionCallback<>() {
			@Override
			public Object execute(RedisOperations operations) {
				operations.multi();

				operations.opsForSet().add(
					FRIEND_RELATION_CACHE + ":" + userId1,
					userId2.toString()
				);
				operations.opsForSet().add(
					FRIEND_RELATION_CACHE + ":" + userId2,
					userId1.toString()
				);

				return operations.exec();
			}
		});
	}

	// 친구 관계 확인
	public Boolean checkFriendRelation(Long userId1, Long userId2) {
		String key = FRIEND_RELATION_CACHE + ":" + userId1;
		String value = userId2.toString();
		return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(key, value)); // 캐시에 없으면 기본적으로 false 반환
	}

	// 친구 관계 삭제 (양방향)
	@Transactional
	public void deleteFriendRelation(Long userId1, Long userId2) {
		redisTemplate.execute(new SessionCallback<>() {
			@Override
			public Object execute(RedisOperations operations) {
				operations.multi();

				operations.opsForSet().remove(
					FRIEND_RELATION_CACHE + ":" + userId1,
					userId2.toString()
				);
				operations.opsForSet().remove(
					FRIEND_RELATION_CACHE + ":" + userId2,
					userId1.toString()
				);

				return operations.exec();
			}
		});
	}
}
