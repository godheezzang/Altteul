package com.c203.altteulbe.ranking.persistent.repository;

import com.c203.altteulbe.ranking.persistent.entity.Tier;

public interface TierRepositoryCustom {
	Tier findTierByPoint(Long point);
	Tier getHighestTier();
}
