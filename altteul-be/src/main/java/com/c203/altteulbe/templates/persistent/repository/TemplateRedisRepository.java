package com.c203.altteulbe.templates.persistent.repository;

import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Repository
public class TemplateRedisRepository {
	/**
	 * 아래는 RedisTemplate을 활용한 쿼리
	 */
	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper;
	/**
	 * 모든 형식의 DTO 혹은 ENTITY를 문자열로 직렬화하여 REDIS에 저장하는 양식
	 */
	public <T> boolean saveData(String key, T data) throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		String value = objectMapper.writeValueAsString(data);
		redisTemplate.opsForValue().set(key, value);
		return true;
	}

	/**
	 * REDIS에서 key에 해당하는 데이터를 찾고 이를 classType에 따라 역직렬화 후 반환하는 양식
	 */
	public <T> Optional<T> getData(String key, Class<T> classType) throws JsonProcessingException {
		String jsonData = (String) redisTemplate.opsForValue().get(key);
		if (StringUtils.hasText(jsonData)) {
			return Optional.ofNullable(objectMapper.readValue(jsonData, classType));
		}
		return Optional.empty();
	}

}