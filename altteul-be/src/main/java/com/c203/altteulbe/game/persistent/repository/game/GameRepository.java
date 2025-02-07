package com.c203.altteulbe.game.persistent.repository.game;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.game.persistent.entity.Game;

@Repository
public interface GameRepository {
	List<Game> findWithItemAndProblemAndAllMemberByUserId(Long userId);
}
