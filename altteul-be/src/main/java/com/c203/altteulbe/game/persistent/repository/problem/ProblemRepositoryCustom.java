package com.c203.altteulbe.game.persistent.repository.problem;

import java.util.List;
import java.util.Optional;

import com.c203.altteulbe.game.persistent.entity.Problem;

public interface ProblemRepositoryCustom {
	List<Long> findAllProblemIds();
}
