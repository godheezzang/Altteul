package com.c203.altteulbe.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

@Configuration
public class JudgeServerConfig {

	@Value("${judge.server.key}")
	private String judgeServerToken;

	@Bean
	public RestTemplate restTemplate() {
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getInterceptors().add((request, body, execution) -> {
			// 헤더에 X-Judge-Server-Token 설정
			String hashedToken = judgeServerToken;
			request.getHeaders().add("X-Judge-Server-Token", hashedToken);
			request.getHeaders().setContentType(MediaType.APPLICATION_JSON);
			return execution.execute(request, body);
		});
		return restTemplate;
	}
}

