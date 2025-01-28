package com.c203.altteulbe.templates.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.data.redis.core.PartialUpdate;
import org.springframework.data.redis.core.RedisKeyValueAdapter;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.c203.altteulbe.templates.persistent.entity.GameEntity;
import com.c203.altteulbe.templates.persistent.entity.GameStatus;
import com.c203.altteulbe.templates.persistent.entity.PlayerEntity;
import com.c203.altteulbe.templates.persistent.repository.GameRepository;
import com.c203.altteulbe.templates.persistent.repository.PlayerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameService {
	private final GameRepository gameRepository;
	private final PlayerRepository playerRepository;
	private RedisKeyValueAdapter redisKeyValueAdapter;
	public GameEntity createGame(String name, String gameType) {
		GameEntity game = GameEntity.builder()
			.name(name)
			.gameType(gameType)
			.status(GameStatus.WAITING)
			.players(new ArrayList<>())
			.scores(new HashMap<>())
			.startTime(LocalDateTime.now())
			.timeToLive(3600L) // 1시간
			.build();

		return gameRepository.save(game);
	}

	public GameEntity addPlayer(String gameId, PlayerEntity player) {
		GameEntity game = gameRepository.findById(gameId)
			.orElseThrow(() -> new RuntimeException("Game not found"));

		PlayerEntity savedPlayer = playerRepository.save(player);

		List<PlayerEntity> players = game.getPlayers();
		players.add(savedPlayer);

		game.setPlayers(players);
		return gameRepository.save(game);
	}

	public void updateScore(String gameId, String playerId, int score) {
		// 부분 업데이트 사용
		PartialUpdate<GameEntity> update = new PartialUpdate<>(gameId, GameEntity.class)
			.set("scores." + playerId, score);

		redisKeyValueAdapter.update(update);
	}

	public void updateGameStatus(String gameId, GameStatus status) {
		// 부분 업데이트 사용
		PartialUpdate<GameEntity> update = new PartialUpdate<>(gameId, GameEntity.class)
			.set("status", status);

		redisKeyValueAdapter.update(update);
	}
}
