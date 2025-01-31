package com.c203.altteulbe.user.persistent.repository;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.user.persistent.entity.QUser;
import com.c203.altteulbe.user.persistent.entity.User;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor
public class UserRepositoryImpl implements UserRepository {

	private final JPAQueryFactory jpaQueryFactory;

	@Override
	public User findByUserId(Long userId) {
		return jpaQueryFactory
			.selectFrom(QUser.user)
			.where(QUser.user.userId.eq(userId))
			.fetchOne();
	}

	@Override
	public void save(User user) {
		jpaQueryFactory.insert(QUser.user)
			.columns(QUser.user.username, QUser.user.password, QUser.user.nickname, QUser.user.mainLang)
			.values(user.getUsername(), user.getPassword(), user.getNickname(), user.getMainLang())
			.execute();
	}

	@Override
	public boolean existsByUsername(String username) {
		Integer fetchOne = jpaQueryFactory
			.selectOne()
			.from(QUser.user)
			.where(QUser.user.username.eq(username))
			.fetchFirst();
		return fetchOne != null;
	}

	@Override
	public boolean existsByNickname(String nickname) {
		Integer fetchOne = jpaQueryFactory
			.selectOne()
			.from(QUser.user)
			.where(QUser.user.nickname.eq(nickname))
			.fetchFirst();
		return fetchOne != null;
	}

}