package com.c203.altteulbe.room.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.room.service.TeamRoomService;
import com.c203.altteulbe.room.web.dto.request.RoomGameStartRequestDto;
import com.c203.altteulbe.room.web.dto.request.RoomRequestDto;
import com.c203.altteulbe.room.web.dto.request.TeamMatchCancelRequestDto;
import com.c203.altteulbe.room.web.dto.response.RoomEnterResponseDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/team")
public class TeamRoomController {

	private final TeamRoomService teamRoomService;

	/*
	 * 팀전 방 입장 API
	 */
	@PostMapping("/enter")
	public ApiResponseEntity<ResponseBody.Success<RoomEnterResponseDto>> enterTeamRoom(
		@RequestBody RoomRequestDto requestDto) {

		RoomEnterResponseDto responseDto = teamRoomService.enterTeamRoom(requestDto);
		return ApiResponse.success(responseDto, HttpStatus.OK);
	}

	/*
	 * 팀전 방 퇴장 API
	 */
	@PostMapping("/leave")
	public ApiResponseEntity<Void> leaveTeamRoom(@RequestBody RoomRequestDto requestDto) {
		teamRoomService.leaveTeamRoom(requestDto);
		return ApiResponse.success();
	}

	/*
	 * 팀전 매칭 API
	 */
	@PostMapping("/matching")
	public ApiResponseEntity<Void> startTeamMatch(@RequestBody RoomGameStartRequestDto requestDto) {
		teamRoomService.startTeamMatch(requestDto);
		return ApiResponse.success();
	}

	/*
	 * 팀전 매칭 취소 API
	 */
	@PostMapping("/matching/cancel")
	public ApiResponseEntity<Void> cancelTeamMatch(@RequestBody TeamMatchCancelRequestDto requestDto) {
		teamRoomService.cancelTeamMatch(requestDto);
		return ApiResponse.success();
	}
}
