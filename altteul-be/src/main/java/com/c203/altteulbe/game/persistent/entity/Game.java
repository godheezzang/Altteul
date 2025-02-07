package com.c203.altteulbe.game.persistent.entity;

import java.time.LocalDateTime;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.entity.BaseCreatedEntity;

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
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class Game extends BaseCreatedEntity {

	@Id
	@Column(name = "game_id", nullable = false, updatable = false)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "problem_id", nullable = false)
	private Problem problem;

	@Enumerated(EnumType.STRING)
	private BattleType battleType;

	private LocalDateTime completedAt;

	public static Game create(Problem problem, BattleType battleType) {
		return Game.builder()
			.problem(problem)
			.battleType(battleType)
			.build();
	}
}
