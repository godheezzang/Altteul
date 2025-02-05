package com.c203.altteulbe.friend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;
import com.c203.altteulbe.friend.web.dto.response.FriendResponseDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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
	public List<FriendResponseDto> getCachedFriendList(Long userId) throws JsonProcessingException {
		String key = RedisKeys.getFriendListKey(userId);
		String jsonFriendList = (String)redisTemplate.opsForValue().get(key);

		if (jsonFriendList == null) {
			return new ArrayList<>(); // 캐시에 데이터가 없으면 빈 리스트 반환
		}
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.readValue(jsonFriendList, new TypeReference<List<FriendResponseDto>>() {
		});
	}

	// 친구 리스트 저장
	public void setFriendList(Long userId, List<FriendResponseDto> friendList) throws JsonProcessingException {
		String key = RedisKeys.getFriendListKey(userId);
		ObjectMapper objectMapper = new ObjectMapper();
		String jsonFriendList = objectMapper.writeValueAsString(friendList); // json 형식으로 저장
		redisTemplate.opsForValue().set(key, jsonFriendList, 30, TimeUnit.MINUTES);

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
				ObjectMapper objectMapper = new ObjectMapper();
				operations.multi();

				try {
					updateFriendList(operations, objectMapper, userId1, userId2);
					updateFriendList(operations, objectMapper, userId2, userId1);
				} catch (JsonProcessingException e) {
					throw new RuntimeException(e);
				}

				return operations.exec();
			}
		});
	}

	// 친구 관계 확인
	public Boolean checkFriendRelation(Long userId1, Long userId2) throws JsonProcessingException {
		String key = RedisKeys.getFriendRelationKey(userId1);
		String value = (String)redisTemplate.opsForValue().get(key);
		if (value == null) {
			return false;
		}
		ObjectMapper objectMapper = new ObjectMapper();
		List<Long> friendListIds = objectMapper.readValue(key, new TypeReference<List<Long>>() {
		});
		return friendListIds.contains(userId2); // 캐시에 없으면 기본적으로 false 반환
	}

	// 친구 관계 삭제 (양방향)
	@Transactional
	public void deleteFriendRelation(Long userId1, Long userId2) {
		redisTemplate.execute(new SessionCallback<>() {
			@Override
			public Object execute(RedisOperations operations) {
				ObjectMapper objectMapper = new ObjectMapper();
				operations.multi();

				try {
					removeFriendFromList(operations, objectMapper, userId1, userId2);
					removeFriendFromList(operations, objectMapper, userId2, userId1);
				} catch (JsonProcessingException e) {
					throw new RuntimeException(e);
				}

				return operations.exec();
			}
		});
	}

	// 친구 요청 목록 캐시 저장
	public void cacheFriendRequests(Long userId, List<FriendRequestResponseDto> requests) throws
		JsonProcessingException {
		String key = RedisKeys.geFriendRequestKey(userId);
		ObjectMapper objectMapper = new ObjectMapper();
		String jsonFriendRequestList = objectMapper.writeValueAsString(requests);
		redisTemplate.opsForValue().set(key, jsonFriendRequestList);
		redisTemplate.expire(key, 30, TimeUnit.MINUTES); // TTL 설정
	}

	// 친구 요청 목록 캐시 조회
	public List<FriendRequestResponseDto> getCachedFriendRequests(Long userId) throws JsonProcessingException {
		String key = RedisKeys.geFriendRequestKey(userId);
		String cachedData = (String)redisTemplate.opsForValue().get(key);

		if (cachedData == null) {
			return new ArrayList<>();
		}
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.readValue(cachedData, new TypeReference<List<FriendRequestResponseDto>>() {
		});
	}

	// 친구 요청 캐시 무효화
	public void invalidateFriendRequests(Long userId) {
		String key = RedisKeys.geFriendRequestKey(userId);
		redisTemplate.delete(key);
	}

	// 찬구 관계 update
	private void updateFriendList(RedisOperations operations, ObjectMapper objectMapper, Long userId,
		Long friendId) throws JsonProcessingException {
		String key = RedisKeys.getFriendRelationKey(userId);
		String jsonFriendList = (String)operations.opsForValue().get(key);

		List<Long> friendList = jsonFriendList != null
			? objectMapper.readValue(jsonFriendList, new TypeReference<List<Long>>() {
		})
			: new ArrayList<>();

		if (!friendList.contains(friendId)) {
			friendList.add(friendId);
			operations.opsForValue().set(key, objectMapper.writeValueAsString(friendList), 30, TimeUnit.MINUTES);
		}

	}

	// 친구 관계 삭제(친구 삭제)
	private void removeFriendFromList(RedisOperations operations, ObjectMapper objectMapper, Long userId,
		Long friendId) throws JsonProcessingException {
		String key = RedisKeys.getFriendRelationKey(userId);
		String jsonFriendList = (String)operations.opsForValue().get(key);

		if (jsonFriendList == null) {
			return; // 캐시에 데이터 없으면 아무것도 안 함
		}

		List<Long> friendList = objectMapper.readValue(jsonFriendList, new TypeReference<List<Long>>() {
		});
		if (friendList.remove(friendId)) { // 친구 ID 삭제
			operations.opsForValue().set(key, objectMapper.writeValueAsString(friendList), 30, TimeUnit.MINUTES);
		}
	}
}
