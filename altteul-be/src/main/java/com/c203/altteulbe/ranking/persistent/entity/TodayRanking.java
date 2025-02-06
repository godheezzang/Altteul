package com.c203.altteulbe.ranking.persistent.entity;

import com.c203.altteulbe.common.entity.BaseCreatedEntity;
import com.c203.altteulbe.user.persistent.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
@SuperBuilder
public class TodayRanking extends BaseCreatedEntity {
	@Id
	@Column(name = "ranking_id")
	Long id;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tier_id", nullable = false)
	private Tier tier;

	@Column(name = "ranking_point")
	Long rankingPoint;

	@Column(name = "ranking_change")
	Long rankingChange;
}
