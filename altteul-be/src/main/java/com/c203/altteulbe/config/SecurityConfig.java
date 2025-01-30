package com.c203.altteulbe.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.c203.altteulbe.common.security.filter.JWTFilter;
import com.c203.altteulbe.common.security.filter.LoginFilter;
import com.c203.altteulbe.common.security.utils.JWTUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final AuthenticationConfiguration authenticationConfiguration;
	private final JWTUtil jwtUtil;

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws
		Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable); //csrf 안써요
		http.formLogin(AbstractHttpConfigurer::disable); //폼 로그인 방식 안써요
		http.httpBasic(AbstractHttpConfigurer::disable); //모름

		http.cors((corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {
			@Override
			public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
				CorsConfiguration configuration = new CorsConfiguration();
				configuration.setAllowedOrigins(
					Arrays.asList("http://localhost:3000", "http://localhost:80"));
				configuration.setAllowedMethods(Collections.singletonList("*"));
				configuration.setAllowCredentials(true);
				configuration.setAllowedHeaders(Collections.singletonList("*"));
				configuration.setMaxAge(3600L);
				configuration.setExposedHeaders(Collections.singletonList("Authorization"));

				return configuration;
			}
		})));

		http.authorizeHttpRequests((auth) -> auth
			.requestMatchers(HttpMethod.GET).permitAll()
			.requestMatchers("/api/admin").authenticated()
			.requestMatchers(HttpMethod.POST).authenticated()
			.requestMatchers(HttpMethod.PUT).authenticated()
			.requestMatchers(HttpMethod.DELETE).authenticated()
			.requestMatchers("/api/login", "api/register").permitAll()
			.anyRequest().permitAll());
		http.addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);
		//loginfilter 쓸거임
		http.addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil),
			UsernamePasswordAuthenticationFilter.class);
		//인가 stateless
		http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
}