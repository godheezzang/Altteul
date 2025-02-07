package com.c203.altteulbe.game.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.repository.game.GameRepository;
import com.c203.altteulbe.game.web.dto.response.GameRecordResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {

	private final GameRepository gameRepository;

	public void getGameRecord(Long userId) {
		List<Game> games = gameRepository.findWithItemAndProblemAndAllMemberByUserId(userId);
		// GameRecordResponseDto gameRecordResponseDto

	}
}
