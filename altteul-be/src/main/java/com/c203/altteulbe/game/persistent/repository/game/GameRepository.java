package com.c203.altteulbe.game.persistent.repository.game;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.c203.altteulbe.game.persistent.entity.Game;

@Repository
public interface GameRepository {
	Page<Game> findWithItemAndProblemAndAllMemberByUserId(Long userId, Pageable pageable);

	Optional<Game> findWithAllMemberByGameId(Long gameId);

	Optional<Game> findWithRoomByGameId(Long gameId);

	void saveTestResult();
}
