package com.c203.altteulbe.common.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.experimental.SuperBuilder;

/**
 * createdAt, updateAt을 만드는 BaseCreatedEntity를 상속받은 Entity
 */
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@SuperBuilder(toBuilder = true)
public class BaseCreatedAndUpdatedEntity extends BaseCreatedEntity {
	@UpdateTimestamp
	@Column(nullable = false)
	private LocalDateTime updatedAt;
}
