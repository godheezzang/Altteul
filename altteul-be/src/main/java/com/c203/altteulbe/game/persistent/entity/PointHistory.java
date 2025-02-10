package com.c203.altteulbe.game.persistent.entity;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.dto.PointType;
import com.c203.altteulbe.common.entity.BaseCreatedEntity;
import com.c203.altteulbe.game.persistent.entity.side.SideProblem;
import com.c203.altteulbe.user.persistent.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class PointHistory extends BaseCreatedEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "point_history_id", nullable = false)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_id", nullable = false)
	private Game game;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "side_problem_id")
	private SideProblem sideProblem;      // Null 허용

	@Column(nullable = false)
	private int point;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private BattleType gameType;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PointType pointType;

	public static PointHistory create(Game game, User user, SideProblem sideProblem, int point,
		                       BattleType gameType, PointType pointType) {
		return PointHistory.builder()
			.game(game)
			.user(user)
			.sideProblem(sideProblem)
			.point(point)
			.gameType(gameType)
			.pointType(pointType)
			.build();
	}
}
