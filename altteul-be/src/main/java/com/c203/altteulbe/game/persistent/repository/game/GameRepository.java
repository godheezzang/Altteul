package com.c203.altteulbe.game.persistent.repository.game;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.game.persistent.entity.Game;

@Repository
public interface GameRepository {
	List<Game> findWithItemAndProblemAndAllMemberByUserId(Long userId);

	Optional<Game> findWithAllMemberByGameId(Long gameId);

	Optional<Game> findWithRoomByGameId(Long gameId);

	Optional<Game> findWithRoomAndProblemByGameIdAndTeamId(Long gameId, Long teamId);
}
