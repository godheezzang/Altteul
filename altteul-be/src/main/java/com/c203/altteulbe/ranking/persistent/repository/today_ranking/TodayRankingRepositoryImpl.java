package com.c203.altteulbe.ranking.persistent.repository.today_ranking;

import static com.c203.altteulbe.ranking.persistent.entity.QTodayRanking.*;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.ranking.persistent.entity.QTodayRanking;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TodayRankingRepositoryImpl implements TodayRankingCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public void deleteByUserId(Long userId) {
		queryFactory
					.delete(todayRanking)
					.where(todayRanking.user.userId.eq(userId))
					.execute();
	}
}
