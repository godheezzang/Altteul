package com.c203.altteulbe.game.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.common.response.WebSocketResponse;
import com.c203.altteulbe.game.service.SingleRoomService;
import com.c203.altteulbe.game.web.dto.request.SingleRoomRequestDto;
import com.c203.altteulbe.game.web.dto.response.SingleRoomEnterResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/single")
public class SingleRoomController {
	private final SingleRoomService singleRoomService;
	private final SimpMessagingTemplate messagingTemplate;

	/*
	 * 개인전 방 입장 API
	 */
	@PostMapping("/enter")
	public ApiResponseEntity<ResponseBody.Success<SingleRoomEnterResponseDto>> enterSingleRoom(
										@RequestBody SingleRoomRequestDto requestDto) {

		SingleRoomEnterResponseDto responseDto = singleRoomService.enterSingleRoom(requestDto);

		return ApiResponse.success(responseDto, HttpStatus.OK);
	}

	/*
	 * 개인전 방 퇴장 API
	 */
	@PostMapping("/leave")
	public ApiResponseEntity<Void> leaveSingleRoom(@RequestBody SingleRoomRequestDto requestDto) {
		singleRoomService.leaveSingleRoom(requestDto);
		return ApiResponse.success();
	}
}
