package com.c203.altteulbe.game.persistent.entity;

import com.c203.altteulbe.common.entity.BaseCreatedAndUpdatedEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Problem extends BaseCreatedAndUpdatedEntity {
	@Id
	@Column(name = "problem_id", nullable = false, updatable = false)
	private Long id;

	private String problemTitle;

	@Column(columnDefinition = "TEXT")
	private String description;
	private int point;
	private int totalCount;
}
