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
import com.c203.altteulbe.game.web.dto.request.SingleRoomEnterRequestDto;
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
		@RequestBody SingleRoomEnterRequestDto requestDto) {

		SingleRoomEnterResponseDto responseDto = singleRoomService.enterSingleRoom(requestDto);

		try {
			// 기존 유저들에게 새로운 유저 입장 메시지를 WebSocket으로 전송
			messagingTemplate.convertAndSend("/sub/single/room/" + responseDto.getRoomId(),
												new WebSocketResponse<>("ENTER", responseDto));
		} catch (Exception e) {
			log.error("WebSocket 메시지 전송 실패 : {}", e.getMessage());
		}

		// 입장한 유저에게 API 응답
		return ApiResponse.success(responseDto, HttpStatus.OK);
	}


}
