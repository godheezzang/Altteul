package com.c203.altteulbe.common.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;

/**
 * createdAt을 만드는 Entity
 */
@Setter
@Getter
@MappedSuperclass
public class BaseCreatedEntity {
	@Column(updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	public void prePersist(){
		createdAt = LocalDateTime.now();
	}
}