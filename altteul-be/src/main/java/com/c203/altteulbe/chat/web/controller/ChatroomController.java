package com.c203.altteulbe.chat.web.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.chat.service.ChatroomService;
import com.c203.altteulbe.chat.web.dto.response.ChatroomResponseDto;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatroomController {
	private final ChatroomService chatroomService;

	@GetMapping("/chatroomList")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<List<ChatroomResponseDto>>> getChatroomList(
		@AuthenticationPrincipal Long id) {
		return null;
	}
}
