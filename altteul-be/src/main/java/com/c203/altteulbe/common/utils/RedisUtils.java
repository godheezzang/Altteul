package com.c203.altteulbe.common.utils;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RedisUtils {
	private static final String FRIEND_RELATION_CACHE = "friendRelation";
	private static final String FRIEND_REQUEST_CACHE = "friendRequests";
	private final RedisTemplate<String, Object> redisTemplate;

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
					getFriendRelationKey(userId1),
					userId2.toString()
				);
				operations.opsForSet().add(
					getFriendRelationKey(userId2),
					userId1.toString()
				);

				return operations.exec();
			}
		});
	}

	// 친구 관계 확인
	public Boolean checkFriendRelation(Long userId1, Long userId2) {
		String key = getFriendRelationKey(userId1);
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
					getFriendRelationKey(userId1),
					userId2.toString()
				);
				operations.opsForSet().remove(
					getFriendRelationKey(userId2),
					userId1.toString()
				);

				return operations.exec();
			}
		});
	}

	// 친구 요청 목록 캐시 저장
	public void cacheFriendRequests(Long userId, List<FriendRequestResponseDto> requests) {
		String key = geFriendRequestKey(userId);
		redisTemplate.opsForSet().add(key, requests.toArray());
		redisTemplate.expire(key, 30, TimeUnit.MINUTES); // TTL 설정
	}

	// 친구 요청 목록 캐시 조회
	public List<FriendRequestResponseDto> getCachedFriendRequests(Long userId) {
		String key = geFriendRequestKey(userId);
		Set<Object> cachedData = redisTemplate.opsForSet().members(key);
		return cachedData.stream()
			.map(obj -> (FriendRequestResponseDto)obj)
			.collect(Collectors.toList());
	}

	// 친구 요청 캐시 무효화
	public void invalidateFriendRequests(Long userId) {
		String key = geFriendRequestKey(userId);
		redisTemplate.delete(key);
	}

	private static String geFriendRequestKey(Long userId) {
		return FRIEND_REQUEST_CACHE + ":" + userId;
	}

	private static String getFriendRelationKey(Long userId) {
		return FRIEND_RELATION_CACHE + ":" + userId;
	}
}
