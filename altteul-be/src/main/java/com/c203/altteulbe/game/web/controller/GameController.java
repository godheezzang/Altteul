package com.c203.altteulbe.game.web.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.game.service.GameService;
import com.c203.altteulbe.game.web.dto.judge.response.PingResponse;
import com.c203.altteulbe.game.web.dto.response.GameRecordResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GameController {

	private final GameService gameService;

	@GetMapping("/user/game/history/{userId}")
	public ApiResponseEntity<ResponseBody.Success<List<GameRecordResponseDto>>> getGameRecord(@PathVariable Long userId) {
		return ApiResponse.success(gameService.getGameRecord(userId));
	}

}
