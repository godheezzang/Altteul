package com.c203.altteulbe.templates.persistent.entity;

import com.c203.altteulbe.common.entity.BaseCreatedAndUpdatedEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

/**
 * 생성일시, 변경일시를 상속받은 Entity 생성 가능
 */
@Entity
public class UserJPA extends BaseCreatedAndUpdatedEntity {
	@Id
	Long id;
}

