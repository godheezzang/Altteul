package com.c203.altteulbe.friend.web.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.c203.altteulbe.common.dto.RequestStatus;
import com.c203.altteulbe.friend.service.FriendRequestService;
import com.c203.altteulbe.friend.service.FriendWSService;
import com.c203.altteulbe.friend.service.FriendshipService;
import com.c203.altteulbe.friend.web.dto.request.CreateFriendRequestDto;
import com.c203.altteulbe.friend.web.dto.request.DeleteFriendRequestDto;
import com.c203.altteulbe.friend.web.dto.request.ProcessFriendRequestDto;
import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;
import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class FriendRequestWSController {
	private final FriendRequestService friendRequestService;

	private final FriendshipService friendshipService;

	private final FriendWSService friendWSService;

	// 친구 신청
	@MessageMapping("/friend/request")
	@PreAuthorize("isAuthenticated()")
	public void handleFriendRequest(@Payload CreateFriendRequestDto request,
		@AuthenticationPrincipal Long fromUserid) throws JsonProcessingException {
		Long toUserId = request.getToUserId();
		FriendRequestResponseDto result = friendRequestService.createFriendRequest(fromUserid, toUserId);

		friendWSService.sendRequestMessage(request.getToUserId(), result);
	}

	// 친구 요청 처리
	@MessageMapping("/friend/request/process")
	@PreAuthorize("isAuthenticated()")
	public void handleRequestProcess(
		@Payload ProcessFriendRequestDto request,
		@AuthenticationPrincipal Long fromUserid
	) throws JsonProcessingException {
		Long requestId = request.getFriendRequestId();
		RequestStatus status = request.getRequestStatus();
		friendRequestService.processRequest(requestId, fromUserid, status);

		// 친구 신청을 수락했을 경우
		if (status == RequestStatus.A) {
			// 클라이언트에게 업데이트가 필요하다고 알림
			friendWSService.sendFriendListUpdateMessage(fromUserid);
			friendWSService.sendFriendListUpdateMessage(request.getToUserId());
		}
	}

	// 친구 삭제
	@MessageMapping("/friend/delete")
	@PreAuthorize("isAuthenticated()")
	public void handleFriendDelete(@Payload DeleteFriendRequestDto request,
		@AuthenticationPrincipal Long id) {
		friendshipService.deleteFriendship(id, request.getFriendId());

		// 친구 삭제 했을 경우 클라이언트에게 업데이트가 필요하다고 알림
		friendWSService.sendFriendListUpdateMessage(id);
		friendWSService.sendFriendListUpdateMessage(request.getFriendId());

	}
}
