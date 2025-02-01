package com.c203.altteulbe.user.service;

import org.springframework.stereotype.Service;

import com.c203.altteulbe.user.web.dto.response.UserProfileResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	public UserProfileResponseDto getUserProfile(Long userId) {
		return new UserProfileResponseDto();
	}
}
