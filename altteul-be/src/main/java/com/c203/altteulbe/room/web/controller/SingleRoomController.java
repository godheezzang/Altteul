package com.c203.altteulbe.room.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.room.service.SingleRoomService;
import com.c203.altteulbe.room.web.dto.request.RoomGameStartRequestDto;
import com.c203.altteulbe.room.web.dto.request.RoomRequestDto;
import com.c203.altteulbe.room.web.dto.response.RoomEnterResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/single")
public class SingleRoomController {

	private final SingleRoomService singleRoomService;

	/*
	 * 개인전 방 입장 API
	 */
	@PostMapping("/enter")
	public ApiResponseEntity<ResponseBody.Success<RoomEnterResponseDto>> enterSingleRoom(
		@RequestBody RoomRequestDto requestDto) {

		RoomEnterResponseDto responseDto = singleRoomService.enterSingleRoom(requestDto);
		return ApiResponse.success(responseDto, HttpStatus.OK);
	}

	/*
	 * 개인전 방 퇴장 API
	 */
	@PostMapping("/leave")
	public ApiResponseEntity<Void> leaveSingleRoom(@RequestBody RoomRequestDto requestDto) {
		singleRoomService.leaveSingleRoom(requestDto);
		return ApiResponse.success();
	}

	/*
	 * 개인전 게임 시작 API
	 */
	@PostMapping("/start")
	public ApiResponseEntity<Void> startGame(@RequestBody RoomGameStartRequestDto requestDto) {
		singleRoomService.startGame(requestDto);
		return ApiResponse.success();
	}
}
