package com.c203.altteulbe.common.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;

/**
 * createdAt, updateAt을 만드는 BaseCreatedEntity를 상속받은 Entity
 */
@Setter
@Getter
@MappedSuperclass
public class BaseCreatedAndUpdatedEntity extends BaseCreatedEntity {
	@Column()
	private LocalDateTime updatedAt;

	@PreUpdate
	public void preUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
