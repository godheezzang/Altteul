package com.c203.altteulbe.user.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.user.service.UserService;
import com.c203.altteulbe.user.web.dto.response.SearchUserResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	@GetMapping("/me")
	public Long getCurrentUserId(@AuthenticationPrincipal Long id) {
		System.out.println(id);
		return id;
	}

	@GetMapping("/search")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<SearchUserResponseDto>> getCurrentUser(
		@AuthenticationPrincipal Long id,
		@RequestParam(value = "nickname") String nickname) {
		SearchUserResponseDto response = userService.searchUser(id, nickname);
		return ApiResponse.success(response, HttpStatus.OK);
	}
}
