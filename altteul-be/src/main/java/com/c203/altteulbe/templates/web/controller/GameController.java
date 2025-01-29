package com.c203.altteulbe.templates.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.templates.persistent.entity.GameEntity;
import com.c203.altteulbe.templates.persistent.entity.PlayerEntity;
import com.c203.altteulbe.templates.service.GameService;
import com.c203.altteulbe.templates.web.dto.request.TemplateRequestDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class GameController {

	private final GameService gameService;

	@PostMapping("/api/games")
	public GameEntity createGame(@RequestBody TemplateRequestDto request) {
		// 생성 응답 바디 : DTO 직접 설정 + 상태 직접 설정 + 메세지 직접 설정
		ApiResponse.success("dto넣을곳", HttpStatus.OK, "message");

		// 생성 응답 바디 : DTO 직접 설정 + 상태 직접 설정 + 기본 메세지 "OK"
		ApiResponse.success("dto넣을곳", HttpStatus.OK);

		// 생성 응답 바디 : DTO 직접 설정 + 기본 STATUS 200 + 기본 메세지 "OK"
		ApiResponse.success("dto넣을곳");

		// 생성 응답 바디 : 기본 status 200
		ApiResponse.success();
		return gameService.createGame("123", "123");
	}

	@PostMapping("/api/games/{gameId}/players")
	public GameEntity addPlayer(@PathVariable String gameId, @RequestBody PlayerEntity player) {
		return gameService.addPlayer(gameId, player);
	}

	@PatchMapping("/api/games/{gameId}/scores/{playerId}")
	public void updateScore(@PathVariable String gameId,
		@PathVariable String playerId,
		@RequestBody int score) {
		gameService.updateScore(gameId, playerId, score);
	}
}
