package com.c203.altteulbe.common.security.filter;

import java.io.BufferedReader;
import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.c203.altteulbe.common.security.utils.JWTUtil;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.web.dto.request.LoginRequestDto;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

	private final AuthenticationManager authenticationManager;
	private final JWTUtil jwtUtil;

	public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
		setFilterProcessesUrl("/api/login");  // 로그인 경로를 /api/login으로 설정
	}
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
		LoginRequestDto loginRequestDto = null;
		try {
			// ServletRequest의 InputStream을 String으로 변환
			StringBuilder stringBuilder = new StringBuilder();
			BufferedReader bufferedReader = request.getReader();
			String line;
			while ((line = bufferedReader.readLine()) != null) {
				stringBuilder.append(line);
			}
			System.out.println("Request Body: " + stringBuilder.toString());
			// JSON 문자열을 LoginRequest 객체로 변환
			ObjectMapper objectMapper = new ObjectMapper();
			loginRequestDto = objectMapper.readValue(stringBuilder.toString(), LoginRequestDto.class);
		} catch (Exception e) {
			throw new RuntimeException("Authentication failed", e);
		}
		String id = loginRequestDto.getId();
		String password = loginRequestDto.getPassword();

		// 로깅 추가 (디버깅용)
		System.out.println("Attempting authentication for ID: " + id);

		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(id, password, List.of(new SimpleGrantedAuthority("USER")));
		return authenticationManager.authenticate(authToken);
	};

	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
		User userDetails = (User) authentication.getPrincipal();

		String token = jwtUtil.createJwt(userDetails.getUserId(), 60*60*10000L);

		response.addHeader("Authorization", "Bearer " + token);
	}
}