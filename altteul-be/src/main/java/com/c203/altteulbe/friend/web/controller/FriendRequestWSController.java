package com.c203.altteulbe.friend.web.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.c203.altteulbe.common.dto.RequestStatus;
import com.c203.altteulbe.friend.service.FriendRequestService;
import com.c203.altteulbe.friend.service.FriendshipService;
import com.c203.altteulbe.friend.web.dto.request.CreateFriendRequestDto;
import com.c203.altteulbe.friend.web.dto.request.DeleteFriendRequestDto;
import com.c203.altteulbe.friend.web.dto.request.ProcessFriendRequestDto;
import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;
import com.c203.altteulbe.websocket.dto.response.WebSocketResponse;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class FriendRequestWSController {
	private final FriendRequestService friendRequestService;
	private final SimpMessagingTemplate simpMessagingTemplate;
	private final FriendshipService friendshipService;

	// 친구 신청
	@MessageMapping("/friend/request")
	@PreAuthorize("isAuthenticated()")
	public void handleFriendRequest(@Payload CreateFriendRequestDto request,
		@AuthenticationPrincipal Long fromUserid) {
		Long toUserId = request.getToUserId();
		FriendRequestResponseDto result = friendRequestService.createFriendRequest(fromUserid, toUserId);

		simpMessagingTemplate.convertAndSend(
			"/sub/user/" + request.getToUserId() + "/notification",
			WebSocketResponse.withData("친구 신청이 도착했습니다.", result)
		);
	}

	// 친구 요청 처리
	@MessageMapping("/friend/request/process")
	@PreAuthorize("isAuthenticated()")
	public void handleRequestProcess(
		@Payload ProcessFriendRequestDto request,
		@AuthenticationPrincipal Long fromUserid
	) {
		Long requestId = request.getFriendRequestId();
		RequestStatus status = request.getRequestStatus();
		friendRequestService.processRequest(requestId, fromUserid, status);
		// Todo: websocket 부분 로직

	}

	// 친구 삭제
	@MessageMapping("/friend/delete")
	@PreAuthorize("isAuthenticated()")
	public void handleFriendDelete(@Payload DeleteFriendRequestDto request,
		@AuthenticationPrincipal Long userId) {
		friendshipService.deleteFriendship(userId, request.getFriendId());
		// Todo : websocket 부분 로직

	}
}
