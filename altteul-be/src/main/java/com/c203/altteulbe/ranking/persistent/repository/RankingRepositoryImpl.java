package com.c203.altteulbe.ranking.persistent.repository;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RankingRepositoryImpl implements RankingCustomRepository {

	private final JPAQueryFactory jpaQueryFactory;

}
