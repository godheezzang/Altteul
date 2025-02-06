package com.c203.altteulbe.friend.web.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.PageResponse;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.friend.service.FriendshipService;
import com.c203.altteulbe.friend.web.dto.response.FriendResponseDto;
import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class FriendshipController {
	private final FriendshipService friendshipService;

	// 친구 리스트 조회
	@GetMapping("/friends")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<PageResponse<FriendResponseDto>>> getFriends(
		@AuthenticationPrincipal Long id,
		@PageableDefault(page = 0, size = 10) Pageable pageable
	) throws JsonProcessingException {
		PageResponse<FriendResponseDto> friends = friendshipService.getFriendsList(id, pageable);
		return ApiResponse.success(friends, HttpStatus.OK);
	}
}
