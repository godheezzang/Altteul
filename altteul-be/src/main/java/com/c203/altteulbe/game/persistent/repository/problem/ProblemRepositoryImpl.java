package com.c203.altteulbe.game.persistent.repository.problem;

import static com.c203.altteulbe.game.persistent.entity.QProblem.*;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.game.persistent.entity.Problem;
import com.c203.altteulbe.game.persistent.entity.QProblem;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ProblemRepositoryImpl implements ProblemRepositoryCustom {

	private JPAQueryFactory queryFactory;

	@Override
	public List<Long> findAllProblemIds() {
		return queryFactory
						.select(problem.id)
						.from(problem)
						.fetch();
	}
}
