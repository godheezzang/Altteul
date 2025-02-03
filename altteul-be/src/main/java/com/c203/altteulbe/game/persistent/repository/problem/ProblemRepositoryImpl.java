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

	// 게임 시작 시 문제 랜덤 추출
	@Override
	public Optional<Problem> findRandomProblem() {
		List<Long> problemIds = queryFactory
										.select(problem.id)
										.from(problem)
										.fetch();
		if (problemIds.isEmpty()) {
			return Optional.empty();
		}

		Long randomProblemId = problemIds.get(new Random().nextInt(problemIds.size()));

		Problem selectedProblem = queryFactory
											.selectFrom(problem)
											.where(problem.id.eq(randomProblemId))
											.fetchOne();

		return Optional.ofNullable(selectedProblem);
	}
}
