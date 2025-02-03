package com.c203.altteulbe.game.persistent.repository.problem;

import java.util.Optional;

import com.c203.altteulbe.game.persistent.entity.Problem;

public interface ProblemRepositoryCustom {
	Optional<Problem> findRandomProblem();
}
