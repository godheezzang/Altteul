package com.c203.altteulbe.user.web.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.user.service.AuthService;
import com.c203.altteulbe.user.web.dto.request.LoginRequestDto;
import com.c203.altteulbe.user.web.dto.request.RegisterUserRequestDto;
import com.c203.altteulbe.user.web.dto.request.ValidateIdRequestDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping(value = "/register", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ApiResponseEntity<Void> registerUser(@RequestPart(value="request") RegisterUserRequestDto request,
		@RequestPart(value = "profileImg", required = false) MultipartFile profileImg) {

		authService.registerUser(request, profileImg);

		return ApiResponse.success();
	}

	@PostMapping("/login")
	public ApiResponseEntity<Void> login(@RequestBody LoginRequestDto request) {
		return ApiResponse.success();
	}

	@PostMapping("/id-check")
	public ApiResponseEntity<Void> validateId(ValidateIdRequestDto request) {
		authService.validateId(request.getUsername());
		return ApiResponse.success();
	}
}
