package com.c203.altteulbe.room.persistent.entity;

import java.time.LocalDateTime;

import com.c203.altteulbe.common.dto.BattleResult;
import com.c203.altteulbe.common.dto.Language;
import com.c203.altteulbe.common.entity.BaseCreatedEntity;
import com.c203.altteulbe.game.persistent.entity.Game;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
public class Room extends BaseCreatedEntity {
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_id")
	private Game game;

	@Column(columnDefinition = "TEXT")
	private String code;

	@Enumerated(EnumType.STRING)
	private BattleResult battleResult;

	private Integer rewardPoint;
	private String lastExecuteTime;
	private String lastExecuteMemory;

	@Enumerated(EnumType.STRING)
	private Language lang;

	private boolean activation;
	private LocalDateTime finishTime;
	private Integer solvedTestcaseCount;

	public void updateStatusByGameClear(BattleResult battleResult) {
		this.rewardPoint += 100;
		this.battleResult = battleResult;
		this.activation = false;
		this.finishTime = LocalDateTime.now();
	}

	public void updateSubmissionRecord(Integer solvedTestcaseCount, String lastExecuteTime, String lastExecuteMemory, String code) {
		if (this.solvedTestcaseCount == null) {
			this.solvedTestcaseCount = solvedTestcaseCount;
		} else if (solvedTestcaseCount != null && this.solvedTestcaseCount != null) {
			if (this.solvedTestcaseCount > solvedTestcaseCount) {
				this.solvedTestcaseCount = solvedTestcaseCount;
				this.lastExecuteTime = lastExecuteTime;
				this.lastExecuteMemory = lastExecuteMemory;
				this.code = code;
			}
		}
	}

	public void updateBattleResult(BattleResult battleResult) {
		this.battleResult = battleResult;
	}
}
