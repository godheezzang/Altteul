package com.c203.altteulbe.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableAspectJAutoProxy
public class WebMvcConfig implements WebMvcConfigurer {

	private static final long MAX_AGE_SECS = 3600;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
			.allowedOriginPatterns("http://localhost:*")
			// .allowedOrigins(
			// 	"http://localhost:3000",
			// 	"http://localhost:5173",
			// 	"http://localhost:5174",
			// 	"http://localhost:8080",
			// 	"http://localhost:8081",
			// 	"http://localhost:8082",
			// 	"http://localhost:80")
			.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
			.allowedHeaders("*")
			.exposedHeaders("Authorization")
			.allowCredentials(true)
			.maxAge(MAX_AGE_SECS);
	}
}