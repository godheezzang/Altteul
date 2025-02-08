package com.c203.altteulbe.game.persistent.repository.game;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.c203.altteulbe.game.persistent.entity.Game;

@Repository
public interface GameRepository {
	Page<Game> findWithItemAndProblemAndAllMemberByUserId(Long userId, Pageable pageable);
}
