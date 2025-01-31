package com.c203.altteulbe.friend.web.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.friend.service.FriendService;
import com.c203.altteulbe.friend.web.dto.response.FriendResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;

import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class FriendController {
	private final FriendService friendService;

	@GetMapping("/friends")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<Map<String, Object>>> getFriends(
		@AuthenticationPrincipal Long id,
		@RequestParam(defaultValue = "0", value = "page") @Min(0) int page,
		@RequestParam(defaultValue = "10", value = "size") @Min(1) int size
	) {
		Page<FriendResponseDto> friends = friendService.getFriendsList(id, page, size);
		List<FriendResponseDto> friendList = friends.getContent();
		Map<String, Object> responseData = new HashMap<>();
		responseData.put("friends", friendList);
		responseData.put("pageable", friends.getPageable());
		responseData.put("totalElements", friends.getTotalElements());
		responseData.put("totalPages", friends.getTotalPages());
		responseData.put("currentPage", friends.getNumber());
		responseData.put("size", friends.getSize());
		return ApiResponse.success(responseData, HttpStatus.OK);
	}
}
