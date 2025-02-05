package com.c203.altteulbe.friend.service;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;
import com.c203.altteulbe.friend.web.dto.response.FriendResponseDto;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendRedisService {

	private final RedisTemplate<String, Object> redisTemplate;

	@PostConstruct
	public void init() {
		redisTemplate.setEnableTransactionSupport(true);
	}

	// 친구 리스트 조회
	public List<FriendResponseDto> getCachedFriendList(Long userId) {
		String key = RedisKeys.getFriendListKey(userId);
		return (List<FriendResponseDto>)redisTemplate.opsForValue().get(key);
	}

	// 친구 리스트 저장
	public void setFriendList(Long userId, List<FriendResponseDto> friendList) {
		String key = RedisKeys.getFriendListKey(userId);
		redisTemplate.opsForValue().set(key, friendList.toArray(), 30, TimeUnit.MINUTES);
	}

	// 친구 리스트 삭제
	public void invalidateFriendList(Long userId) {
		String key = RedisKeys.getFriendListKey(userId);
		redisTemplate.delete(key);
	}

	// 친구 관계 저장 (양방향)
	@Transactional
	public void setFriendRelation(Long userId1, Long userId2) {
		redisTemplate.execute(new SessionCallback<>() {
			@Override
			public Object execute(RedisOperations operations) {
				operations.multi();

				operations.opsForSet().add(
					RedisKeys.getFriendRelationKey(userId1),
					userId2.toString()
				);
				operations.opsForSet().add(
					RedisKeys.getFriendRelationKey(userId2),
					userId1.toString()
				);

				return operations.exec();
			}
		});
	}

	// 친구 관계 확인
	public Boolean checkFriendRelation(Long userId1, Long userId2) {
		String key = RedisKeys.getFriendRelationKey(userId1);
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
					RedisKeys.getFriendRelationKey(userId1),
					userId2.toString()
				);
				operations.opsForSet().remove(
					RedisKeys.getFriendRelationKey(userId2),
					userId1.toString()
				);

				return operations.exec();
			}
		});
	}

	// 친구 요청 목록 캐시 저장
	public void cacheFriendRequests(Long userId, List<FriendRequestResponseDto> requests) {
		String key = RedisKeys.geFriendRequestKey(userId);
		redisTemplate.opsForSet().add(key, requests.toArray());
		redisTemplate.expire(key, 30, TimeUnit.MINUTES); // TTL 설정
	}

	// 친구 요청 목록 캐시 조회
	public List<FriendRequestResponseDto> getCachedFriendRequests(Long userId) {
		String key = RedisKeys.geFriendRequestKey(userId);
		Set<Object> cachedData = redisTemplate.opsForSet().members(key);
		return cachedData.stream()
			.map(obj -> (FriendRequestResponseDto)obj)
			.collect(Collectors.toList());
	}

	// 친구 요청 캐시 무효화
	public void invalidateFriendRequests(Long userId) {
		String key = RedisKeys.geFriendRequestKey(userId);
		redisTemplate.delete(key);
	}

}
