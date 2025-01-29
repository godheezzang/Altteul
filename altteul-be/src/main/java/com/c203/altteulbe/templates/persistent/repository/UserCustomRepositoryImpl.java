package com.c203.altteulbe.templates.persistent.repository;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.templates.persistent.entity.QUserJPA;
import com.c203.altteulbe.templates.persistent.entity.UserJPA;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class UserCustomRepositoryImpl implements UserCustomRepository {

	private final JPAQueryFactory jpaQueryFactory;


	@Override
	public UserJPA findById(Long id) {
		return jpaQueryFactory.selectFrom(QUserJPA.userJPA)
			.where(QUserJPA.userJPA.id.eq(id))
			.fetchOne();
	}
}