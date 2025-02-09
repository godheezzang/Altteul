package com.c203.altteulbe.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.c203.altteulbe.common.security.filter.JWTFilter;
import com.c203.altteulbe.common.security.filter.LoginFilter;
import com.c203.altteulbe.common.security.utils.JWTUtil;
import com.c203.altteulbe.common.security.utils.JwtAccessDeniedHandler;
import com.c203.altteulbe.common.security.utils.JwtAuthenticationEntryPoint;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity // 스프링 시큐리티 어노테이션 활성화를 위해서
public class SecurityConfig {

	private final AuthenticationConfiguration authenticationConfiguration;
	private final JWTUtil jwtUtil;
	private final AuthenticationSuccessHandler authenticationSuccessHandler;
	private final DefaultOAuth2UserService defaultOAuth2UserService;
	private final JwtAuthenticationEntryPoint entryPoint;
	private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws
		Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable); //csrf 안써요
		http
			.formLogin(AbstractHttpConfigurer::disable); //폼 로그인 방식 안써요
		http.httpBasic(AbstractHttpConfigurer::disable); //모름

		http.cors((corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {
			@Override
			public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
				CorsConfiguration configuration = new CorsConfiguration();
				configuration.setAllowedOriginPatterns(Arrays.asList("*"));
				// configuration.setAllowedOrigins(
				// 	Arrays.asList(
				// 		"http://localhost:3000",
				// 		"http://localhost:5173",
				// 		"http://localhost:5174",
				// 		"http://localhost:8080",
				// 		"http://localhost:8081",
				// 		"http://localhost:8082",
				// 		"http://localhost:80"));
				configuration.setAllowedMethods(Collections.singletonList("*"));
				configuration.setAllowCredentials(true);
				configuration.setAllowedHeaders(Collections.singletonList("*"));
				configuration.setMaxAge(3600L);
				configuration.setExposedHeaders(Collections.singletonList("*"));

				return configuration;
			}
		})));

		http.authorizeHttpRequests((auth) -> auth
			.requestMatchers(HttpMethod.GET).permitAll()
			.requestMatchers(HttpMethod.POST).permitAll()
			.requestMatchers("/ws/**").permitAll()
			.requestMatchers("/api/admin").authenticated()
			.requestMatchers("/api/login", "/api/register", "/api/judge-ping-check").permitAll()
			.requestMatchers(HttpMethod.POST).authenticated()
			.requestMatchers(HttpMethod.PUT).authenticated()
			.requestMatchers(HttpMethod.DELETE).authenticated()
			.anyRequest().permitAll());
		http.addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class)
			.exceptionHandling(handler
				-> handler.authenticationEntryPoint(entryPoint).accessDeniedHandler(jwtAccessDeniedHandler));
		//loginfilter 쓸거임
		http.addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil),
			UsernamePasswordAuthenticationFilter.class);

		//인가 stateless
		http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		http
			.oauth2Login(oauth -> oauth
				.successHandler(authenticationSuccessHandler)
				.userInfoEndpoint(user -> user
					.userService(defaultOAuth2UserService)
				)
			);

		return http.build();
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
}