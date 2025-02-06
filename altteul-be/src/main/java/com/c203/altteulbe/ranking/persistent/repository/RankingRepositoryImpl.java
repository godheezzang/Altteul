package com.c203.altteulbe.ranking.persistent.repository;

import static com.c203.altteulbe.ranking.persistent.entity.QTodayRanking.*;
import static com.c203.altteulbe.user.persistent.entity.QUser.*;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.ranking.persistent.entity.TodayRanking;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RankingRepositoryImpl implements RankingRepository {

	private final JPAQueryFactory jpaQueryFactory;

}
