package com.c203.altteulbe.friend.service;

import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.dto.RequestStatus;
import com.c203.altteulbe.friend.persistent.repository.FriendRequestRepository;
import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.lettuce.core.RedisConnectionException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendRequestService {
	private final FriendRequestRepository friendRequestRepository;
	private final RedisTemplate<String, String> redisTemplate;
	private final ObjectMapper objectMapper;
	private final UserJPARepository userJPARepository;

	private static final String FRIEND_REQUEST_CACHE_KEY = "friend:request:pending:";
	private static final Duration CACHE_TTL = Duration.ofMinutes(5);

	@Transactional
	public Page<FriendRequestResponseDto> getPendingRequestsFromRedis(Long userId, int page, int size) {
		String cacheKey = FRIEND_REQUEST_CACHE_KEY + userId;
		List<FriendRequestResponseDto> allRequest;

		String cachedValue = redisTemplate.opsForValue().get(cacheKey);
		if (cachedValue != null) {
			try {
				allRequest = objectMapper.readValue(cachedValue, new TypeReference<>() {
				});
				return paginate(allRequest, page, size);
			} catch (RedisConnectionException e) {
				log.error("Redis 연결 실패: {}", e.getMessage());
				allRequest = getPendingFriendRequestsFromDB(userId);
				return paginate(allRequest, page, size);
			} catch (JsonProcessingException e) {
				log.error("캐시 역직렬화 에러: {}", e.getMessage());
				invalidateRequestCache(userId);
			}
		}

		userJPARepository.findByUserId(userId).orElseThrow(() -> {
			log.error("유저 찾기 실패");
			return new NotFoundUserException();
		});
		allRequest = getPendingFriendRequestsFromDB(userId);

		try {
			String value = objectMapper.writeValueAsString(allRequest);
			redisTemplate.opsForValue().set(cacheKey, value, CACHE_TTL);
		} catch (JsonProcessingException e) {
			log.error("캐시 직렬화 에러: {}", e.getMessage());
		}
		return paginate(allRequest, page, size);
	}

	private List<FriendRequestResponseDto> getPendingFriendRequestsFromDB(Long userId) {
		return friendRequestRepository.findAllByToUserIdAndRequestStatus(
				userId,
				RequestStatus.P)
			.stream()
			.map(FriendRequestResponseDto::from)
			.collect(Collectors.toList());
	}

	public void invalidateRequestCache(Long userId) {
		Set<String> keys = redisTemplate.keys(FRIEND_REQUEST_CACHE_KEY + userId);
		if (keys != null) {
			redisTemplate.delete(keys);
		}
	}

	private Page<FriendRequestResponseDto> paginate(List<FriendRequestResponseDto> allRequests, int page, int size) {
		int total = allRequests.size();
		int start = Math.min(page * size, total);
		int end = Math.min((page + 1) * size, total);

		return new PageImpl<>(
			allRequests.subList(start, end),
			PageRequest.of(page, size),
			total
		);
	}

}
