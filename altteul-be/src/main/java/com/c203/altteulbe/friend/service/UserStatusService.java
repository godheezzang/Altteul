package com.c203.altteulbe.friend.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.c203.altteulbe.common.exception.BusinessException;

import io.lettuce.core.RedisConnectionException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserStatusService {
	private final RedisTemplate<String, String> redisTemplate;
	private static final String USER_STATUS = "user_status";

	// 유저 온라인 상태 설정
	public void setUserOnline(Long userId) {
		validateUserId(userId);
		try {
			String key = USER_STATUS + ":" + userId;
			redisTemplate.opsForValue().set(key, "online");
		} catch (RedisConnectionException e) {
			log.error("Redis 연결 실패: {}", e.getMessage());
			throw new BusinessException("Redis 연결에 실패했습니다.", HttpStatus.SERVICE_UNAVAILABLE);
		} catch (Exception e) {
			log.error("사용자 온라인 상태 설정 중 오류 발생: {}", e.getMessage());
			throw new BusinessException("사용자 상태 업데이트에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	// 유저 오프라인 상태로 변경
	public void setUserOffline(Long userId) {
		validateUserId(userId);
		try {
			String key = USER_STATUS + ":" + userId;
			redisTemplate.delete(key);
		} catch (RedisConnectionException e) {
			log.error("Redis 연결 실패: {}", e.getMessage());
			throw new BusinessException("Redis 연결에 실패했습니다.", HttpStatus.SERVICE_UNAVAILABLE);
		} catch (Exception e) {
			log.error("사용자 오프라인 상태 설정 중 오류 발생: {}", e.getMessage());
			throw new BusinessException("사용자 상태 업데이트에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 유저 온라인 상태 확인
	public boolean isUserOnline(Long userId) {
		validateUserId(userId);
		try {
			String key = USER_STATUS + ":" + userId;
			return Boolean.TRUE.equals(redisTemplate.hasKey(key));
		} catch (RedisConnectionException e) {
			log.error("Redis 연결 실패: {}", e.getMessage());
			return false;
		} catch (Exception e) {
			log.error("사용자 상태 확인 중 오류 발생: {}", e.getMessage());
			return false;
		}
	}

	private void validateUserId(Long userId) {
		if (userId == null) {
			throw new BusinessException("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
		}
	}

}
