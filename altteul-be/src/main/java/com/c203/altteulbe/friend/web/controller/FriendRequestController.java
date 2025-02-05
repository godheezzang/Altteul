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
import com.c203.altteulbe.friend.service.FriendRequestService;
import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;
import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@PreAuthorize("isAuthenticated()")
public class FriendRequestController {
	private final FriendRequestService friendRequestService;

	// 친구 요청 리스트 조회
	@GetMapping("/friend/request")
	public ApiResponseEntity<ResponseBody.Success<PageResponse<FriendRequestResponseDto>>> getFriendRequestList(
		@AuthenticationPrincipal Long id,
		@PageableDefault(page = 0, size = 10) Pageable pageable
	) throws JsonProcessingException {
		PageResponse<FriendRequestResponseDto> friendRequest = friendRequestService.getPendingRequestsFromRedis(id,
			pageable);
		return ApiResponse.success(friendRequest, HttpStatus.OK);
	}

}
