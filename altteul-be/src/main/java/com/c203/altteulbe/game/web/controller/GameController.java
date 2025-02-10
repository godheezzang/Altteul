package com.c203.altteulbe.game.web.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.PageResponse;
import com.c203.altteulbe.common.response.ResponseBody;
import com.c203.altteulbe.game.service.GameHistoryService;
import com.c203.altteulbe.game.service.GameResultService;
import com.c203.altteulbe.game.web.dto.record.response.GameRecordResponseDto;
import com.c203.altteulbe.game.web.dto.result.response.GameResultResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GameController {

	private final GameResultService gameResultService;
	private final GameHistoryService gameHistoryService;

	@GetMapping("/game/history/{userId}")
	public ApiResponseEntity<ResponseBody.Success<PageResponse<GameRecordResponseDto>>> getGameRecord(@PathVariable Long userId,
		@PageableDefault(page = 0, size = 10) Pageable pageable) {

		return ApiResponse.success(gameHistoryService.getGameRecord(userId, pageable));
	}

	@GetMapping("/game/{gameId}/result")
	public ApiResponseEntity<ResponseBody.Success<GameResultResponseDto>> getGameResult(@PathVariable Long gameId, @AuthenticationPrincipal Long userId) {
		return ApiResponse.success(gameResultService.getGameResult(gameId, userId));
	}
}
