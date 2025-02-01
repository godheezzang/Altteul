package com.c203.altteulbe.user.web.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.user.service.UserService;
import com.c203.altteulbe.user.web.dto.response.UserProfileResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("/me")
	public  ApiResponseEntity<ResponseBody.Success<UserProfileResponseDto>> getMyProfile(@AuthenticationPrincipal Long userId) {
		userService.getUserProfile(userId);
		return ApiResponse.success(userService.getUserProfile(userId));
	}

	@GetMapping("/{userId}")
	public ApiResponseEntity<ResponseBody.Success<UserProfileResponseDto>> getUserProfile(@PathVariable("userId") Long userId) {
		return ApiResponse.success(userService.getUserProfile(userId));
	}
}
