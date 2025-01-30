package com.c203.altteulbe.common.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.experimental.SuperBuilder;

/**
 * createdAt을 만드는 Entity
 */
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@SuperBuilder(toBuilder = true)
public class BaseCreatedEntity {
	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;
}