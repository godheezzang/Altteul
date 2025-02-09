package com.c203.altteulbe.friend.web.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

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
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class FriendRequestWSController {
	private final FriendRequestService friendRequestService;

	private final FriendshipService friendshipService;

	private final FriendWSService friendWSService;

	// 친구 신청
	@MessageMapping("/friend/request")
	public void handleFriendRequest(@Payload CreateFriendRequestDto request,
		SimpMessageHeaderAccessor headerAccessor) throws
		JsonProcessingException {
		Long fromUserId = getUserIdFromHeaderAccessor(headerAccessor);
		log.info("유저 {}로부터 유저 {}가 친구 요청 받기", fromUserId, request.getToUserId()); // 에게 -> 가
		Long toUserId = request.getToUserId();
		FriendRequestResponseDto result = friendRequestService.createFriendRequest(fromUserId, toUserId);

		friendWSService.sendRequestMessage(toUserId, result);
		log.info("유저 {}에게 친구 요청 보내기", request.getToUserId());
	}

	// 친구 요청 처리
	@MessageMapping("/friend/request/process")
	public void handleRequestProcess(
		@Payload ProcessFriendRequestDto request,
		SimpMessageHeaderAccessor headerAccessor
	) throws JsonProcessingException {
		Long fromUserId = getUserIdFromHeaderAccessor(headerAccessor);
		log.info("유저 {}가 받은 친구 요청 처리", request.getToUserId());
		Long requestId = request.getFriendRequestId();
		RequestStatus status = request.getRequestStatus();
		friendRequestService.processRequest(requestId, fromUserId, status);
		log.info("친구 신청이 {} 되었습니다.", status == RequestStatus.A ? "수락" : "거절");
		// 친구 신청을 수락했을 경우
		if (status == RequestStatus.A) {
			// 클라이언트에게 업데이트가 필요하다고 알림
			log.info("현재 로그인한 유저 id: {}", fromUserId); // 현재 로그인한 유저의 id
			log.info("친구 요청을 보낸 유저의 id: {}", request.getFromUserId()); // 친구 요청을 보낸 유저의 id
			friendWSService.sendFriendListUpdateMessage(fromUserId);
			friendWSService.sendFriendListUpdateMessage(request.getFromUserId());
		}
	}

	// 친구 삭제
	@MessageMapping("/friend/delete")
	public void handleFriendDelete(@Payload DeleteFriendRequestDto request,
		SimpMessageHeaderAccessor headerAccessor) {
		Long userId = getUserIdFromHeaderAccessor(headerAccessor);
		friendshipService.deleteFriendship(userId, request.getFriendId());
		// 친구 삭제 했을 경우 클라이언트에게 업데이트가 필요하다고 알림
		log.info("현재 로그인한 유저 id: {}", userId); // 현재 로그인한 유저의 id
		log.info("삭제 하고 싶은 유저의 id: {}", request.getFriendId()); // 삭제 하고 싶은 유저의 id
		friendWSService.sendFriendListUpdateMessage(userId);
		friendWSService.sendFriendListUpdateMessage(request.getFriendId());
		log.info("삭제 완료");

	}

	private static long getUserIdFromHeaderAccessor(SimpMessageHeaderAccessor headerAccessor) {
		return Long.parseLong(headerAccessor.getSessionAttributes().get("userId").toString());
	}
}
