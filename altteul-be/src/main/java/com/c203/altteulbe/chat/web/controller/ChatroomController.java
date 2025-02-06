package com.c203.altteulbe.chat.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.chat.service.ChatMessageService;
import com.c203.altteulbe.chat.service.ChatroomService;
import com.c203.altteulbe.chat.web.dto.request.ChatMessageRequestDto;
import com.c203.altteulbe.chat.web.dto.response.ChatMessageResponseDto;
import com.c203.altteulbe.chat.web.dto.response.ChatroomDetailResponseDto;
import com.c203.altteulbe.chat.web.dto.response.ChatroomListResponseDto;
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
	private final SimpMessagingTemplate messagingTemplate;

	// 채팅방 목록 조회
	@GetMapping("/chatroom")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<List<ChatroomListResponseDto>>> getChatroomList(
		@AuthenticationPrincipal Long id) {
		return ApiResponse.success(chatroomService.getAllChatrooms(id), HttpStatus.OK);
	}

	// 친구와의 1:1 채팅방 생성 또는 조회
	@GetMapping("/chatroom/friend/{friendId}")
	@PreAuthorize("isAuthenticated()")
	public ApiResponseEntity<ResponseBody.Success<ChatroomDetailResponseDto>> createOrGetChatroom(
		@PathVariable(value = "friendId") Long friendId,
		@AuthenticationPrincipal Long id) {
		return ApiResponse.success(chatroomService.createOrGetChatroom(id, friendId), HttpStatus.OK);
	}

	// // 2. 채팅 메시지 전송
	// @PostMapping("/messages")
	// public ApiResponseEntity<ResponseBody.Success<ChatMessageResponseDto>> sendMessage(
	// 	@RequestBody ChatMessageRequestDto request,
	// 	@AuthenticationPrincipal Long id) {
	// 	ChatMessageResponseDto message = chatMessageService.sendMessage(id, request);
	// 	messagingTemplate.convertAndSend("/sub/chatroom/" + request.getChatroomId(), message);
	// 	return ApiResponse.success(message, HttpStatus.OK);
	// }

	// // 채팅 메세지 조회
	// @GetMapping("/chatroom/{chatroomId}/messages")
	// @PreAuthorize("isAuthenticated()")
	// public ApiResponseEntity<ResponseBody.Success<List<ChatMessageResponseDto>>> getChatMessages(
	// 	@PathVariable(value = "chatroomId") Long chatroomId,
	// 	@AuthenticationPrincipal Long id) {
	// 	return ApiResponse.success(chatMessageService.getChatMessages(chatroomId, id), HttpStatus.OK);
	// }
}
