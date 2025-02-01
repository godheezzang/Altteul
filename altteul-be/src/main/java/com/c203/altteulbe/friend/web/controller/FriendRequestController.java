package com.c203.altteulbe.friend.web.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.PageResponse;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.friend.service.FriendRequestService;
import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;

import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@PreAuthorize("isAuthenticated()")
public class FriendRequestController {
	private final FriendRequestService friendRequestService;

	@GetMapping("/friend/request")
	public ApiResponseEntity<ResponseBody.Success<PageResponse<FriendRequestResponseDto>>> getFriendRequestList(
		@AuthenticationPrincipal Long id,
		@RequestParam(defaultValue = "0", value = "page") @Min(0) int page,
		@RequestParam(defaultValue = "10", value = "size") @Min(1) int size
	) {
		Page<FriendRequestResponseDto> friendRequest = friendRequestService.getPendingRequests(id, page, size);
		return ApiResponse.success(new PageResponse<>("friendRequests", friendRequest), HttpStatus.OK);
	}

}
