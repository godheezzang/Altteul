package com.c203.altteulbe.chat.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.chat.service.ChatMessageService;
import com.c203.altteulbe.chat.service.ChatroomService;
import com.c203.altteulbe.chat.web.dto.request.ChatroomCreateRequestDto;
import com.c203.altteulbe.chat.web.dto.response.ChatMessageResponseDto;
import com.c203.altteulbe.chat.web.dto.response.ChatroomResponseDto;
import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatroomController {
	private final ChatroomService chatroomService;
	private final ChatMessageService chatMessageService;

	// 채팅방 목록 조회
	@GetMapping("/chatroom")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<List<ChatroomResponseDto>>> getChatroomList(
		@AuthenticationPrincipal Long id) {
		return ApiResponse.success(chatroomService.getAllChatrooms(id), HttpStatus.OK);
	}

	// 채팅방 단일 조회(쓰진 않지만 혹시 몰라서 만들어놓음)
	@GetMapping("chatroom/{chatroomId}")
	public ApiResponseEntity<ResponseBody.Success<ChatroomResponseDto>> getChatroom(
		@PathVariable(value = "chatroomId") Long chatroomId,
		@AuthenticationPrincipal Long id) {
		return ApiResponse.success(chatroomService.getChatroom(chatroomId, id), HttpStatus.OK);
	}

	// 채팅방 생성
	@PostMapping("/chatroom")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<ChatroomResponseDto>> createChatroom(
		@RequestBody ChatroomCreateRequestDto requestDto,
		@AuthenticationPrincipal Long id) {
		return ApiResponse.success(chatroomService.createChatroom(requestDto, id), HttpStatus.CREATED);
	}

	// 채팅방 삭제
	@DeleteMapping("/chatroom/{chatroomId}")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<Void>> deleteChatroom(
		@PathVariable(value = "chatroomId") Long chatroomId,
		@AuthenticationPrincipal Long id) {
		chatroomService.deleteChatroom(chatroomId, id);
		return ApiResponse.success(null, HttpStatus.NO_CONTENT);
	}

	// 채팅 메세지 조회
	@GetMapping("/chatroom/{chatroomId}/messages")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<List<ChatMessageResponseDto>>> getChatMessages(
		@PathVariable(value = "chatroomId") Long chatroomId,
		@RequestParam(required = false) Long lastMessageId,
		@AuthenticationPrincipal Long id) {
		// 페이지네이션을 위한 이전 메시지 조회
		return ApiResponse.success(
			chatMessageService.getChatMessages(chatroomId, lastMessageId, id),
			HttpStatus.OK
		);
	}
}
