package com.c203.altteulbe.ranking.persistent.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.ranking.persistent.entity.TodayRanking;

public interface TodayRankingRepository extends JpaRepository<TodayRanking, Long> {
}
