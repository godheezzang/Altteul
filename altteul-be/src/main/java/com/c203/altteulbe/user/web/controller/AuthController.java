package com.c203.altteulbe.user.web.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.user.service.AuthService;
import com.c203.altteulbe.user.web.dto.request.LoginRequestDto;
import com.c203.altteulbe.user.web.dto.request.RegisterUserRequestDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	public ApiResponseEntity<Void> registerUser(@RequestBody RegisterUserRequestDto request) {
		authService.registerUser();
		return ApiResponse.success();
	}

	@PostMapping("/login")
	public ApiResponseEntity<Void> login(@RequestBody LoginRequestDto request) {
		return ApiResponse.success();
	}
}
