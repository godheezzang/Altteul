package com.c203.altteulbe.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@Configuration
@EnableRedisRepositories
class RedisConfig {
	@Value("${spring.data.redis.host}")
	private String host;

	@Value("${spring.data.redis.port}")
	private int port;

	@Value("${spring.data.redis.password}")
	private String password;

	@Bean
	public RedisConnectionFactory redisConnectionFactory() {
		RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
		redisStandaloneConfiguration.setHostName(host);
		redisStandaloneConfiguration.setPort(port);
		redisStandaloneConfiguration.setPassword(password);
		return new LettuceConnectionFactory(redisStandaloneConfiguration);
	}

	/**
	 * Redis Repository Config 양식
	 */
	@Bean
	public RedisTemplate<?, ?> redisTemplate(RedisConnectionFactory redisConnectionFactory) {

		RedisTemplate<byte[], byte[]> template = new RedisTemplate<byte[], byte[]>();
		template.setConnectionFactory(redisConnectionFactory);
		return template;
	}

	/**
	 * RedisTemplate을 활용할 경우 아래의 양식 커스텀하여 사용
	 */
	// /**
	//  * KeySerializer : redis는 보통 key를 문자열로 관리함. key를 문자열로 직렬화하고 역직렬화하는 역할
	//  * ValueSerializer : redis의 value또한 마찬가지
	//  *
	//  * @return
	//  */
	// @Bean
	// public RedisTemplate<?, ?> redisTemplate() {
	// 	RedisTemplate<?, ?> redisTemplate = new RedisTemplate<>();
	// 	// 일반적인 key:value의 경우 시리얼라이저
	// 	redisTemplate.setKeySerializer(new StringRedisSerializer());
	// 	redisTemplate.setValueSerializer(new StringRedisSerializer());
	//
	// 	// Hash를 사용할 경우 시리얼라이저
	// 	redisTemplate.setHashKeySerializer(new StringRedisSerializer());
	// 	redisTemplate.setHashValueSerializer(new StringRedisSerializer());
	//
	// 	// 모든 경우
	// 	redisTemplate.setDefaultSerializer(new StringRedisSerializer());
	//
	// 	return redisTemplate;
	// }
}