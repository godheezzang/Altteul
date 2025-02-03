package com.c203.altteulbe.friend.web.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;

import com.c203.altteulbe.common.dto.RequestStatus;
import com.c203.altteulbe.common.response.WebSocketResponse;
import com.c203.altteulbe.friend.service.FriendRequestService;
import com.c203.altteulbe.friend.service.FriendshipService;
import com.c203.altteulbe.friend.web.dto.request.FriendRequestDto;
import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class FriendRequestWSController {
	private final FriendRequestService friendRequestService;
	private final SimpMessagingTemplate simpMessagingTemplate;
	private final FriendshipService friendshipService;

	@MessageMapping("/friend/request")
	@PreAuthorize("isAuthenticated()")
	public void handleFriendRequest(@Payload @Valid FriendRequestDto request,
		@AuthenticationPrincipal Long fromUserid) {
		Long toUserId = request.getToUserId();
		FriendRequestResponseDto result = friendRequestService.createFriendRequest(fromUserid, toUserId);

		simpMessagingTemplate.convertAndSend(
			"/sub/user/" + request.getToUserId() + "/notification",
			new WebSocketResponse<>("친구 신청이 도착했습니다.", result)
		);
	}

	@MessageMapping("/friend/request/process")
	@PreAuthorize("isAuthenticated()")
	public void handleRequestProcess(@Payload @Validated(FriendRequestDto.Process.class) FriendRequestDto request,
		@AuthenticationPrincipal Long fromUserid) {
		Long requestId = request.getFriendRequestId();
		RequestStatus status = request.getRequestStatus();
		friendRequestService.processRequest(requestId, fromUserid, status);

		if (request.getRequestStatus() == RequestStatus.A) {
			// Todo : getFriendList 메서드 수정 and EventListener 작성
			simpMessagingTemplate.convertAndSend(
				"/sub/user" + request.getFromUserId() + "friends",
				friendshipService.getFriendsList(fromUserid)
			);
			simpMessagingTemplate.convertAndSend(
				"/sub/user" + request.getToUserId() + "friends",
				friendshipService.getFriendsList(request.getToUserId())
			);
		}
	}

	@MessageMapping("/friend/delete")
	@PreAuthorize("isAuthenticated()")
	public void deleteFriend(@Payload @Valid FriendRequestDto request,
		@AuthenticationPrincipal Long userId) {
		friendshipService.deleteFriendship(userId, request.getToUserId());
		simpMessagingTemplate.convertAndSend(
			"/sub/user" + userId + "friends",
			friendshipService.getFriendsList(fromUserid)
		);
		simpMessagingTemplate.convertAndSend(
			"/sub/user" + request.getToUserId() + "friends",
			friendshipService.getFriendsList(request.getToUserId())
		);
	}
}
