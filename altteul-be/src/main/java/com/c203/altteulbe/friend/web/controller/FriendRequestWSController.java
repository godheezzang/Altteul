package com.c203.altteulbe.friend.web.controller;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import com.c203.altteulbe.common.dto.RequestStatus;
import com.c203.altteulbe.common.response.WebSocketResponse;
import com.c203.altteulbe.friend.service.FriendRequestService;
import com.c203.altteulbe.friend.web.dto.request.FriendRequestDto;
import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class FriendRequestWSController {
	private final FriendRequestService friendRequestService;
	private final SimpMessagingTemplate	simpMessagingTemplate;

	@MessageMapping("/friend/request")
	public void handleFriendRequest(@Payload FriendRequestDto request,
		@AuthenticationPrincipal Long fromUserid) {
		Long toUserId = request.getToUserId();
		FriendRequestResponseDto result = friendRequestService.createFriendRequest(fromUserid, toUserId);

		simpMessagingTemplate.convertAndSend(
			"/sub/user/" + request.getToUserId() + "/notification",
			new WebSocketResponse<>("친구 신청이 도착했습니다.", result)
		);
	}

	@MessageMapping("/friend/request/process")
	public void handleRequestProcess(@Payload FriendRequestDto request,
		@AuthenticationPrincipal Long fromUserid) {
		Long requestId = request.getFriendRequestId();
		RequestStatus status = request.getStatus();
		friendRequestService.processRequest(requestId,fromUserid, status);

	}
}
