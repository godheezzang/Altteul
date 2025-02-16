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
			.allowedOriginPatterns(
				"http://localhost:80",
				"http://localhost:443",
				"http://localhost:5173",
				"http://frontend:80",
				"http://frontend:443",
				"http://frontend:5173",
				"http://host.docker.internal:80",
				"http://host.docker.internal:443",
				"http://host.docker.internal:5173",
				"https://localhost:80",
				"https://localhost:443",
				"https://localhost:5173",
				"https://frontend:80",
				"https://frontend:443",
				"https://frontend:5173",
				"https://host.docker.internal:80",
				"https://host.docker.internal:443",
				"https://host.docker.internal:5173",
				"https://i12c203.p.ssafy.io",
				"https://i12c203.p.ssafy.io:443",
				"https://i12c203.p.ssafy.io:8443"
			)

			.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
			.allowedHeaders("*")
			.exposedHeaders("Authorization", "userid")
			.allowCredentials(true)
			.maxAge(MAX_AGE_SECS);
	}
}