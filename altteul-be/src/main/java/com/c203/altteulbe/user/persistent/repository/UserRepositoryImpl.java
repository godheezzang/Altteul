package com.c203.altteulbe.user.persistent.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.user.persistent.entity.QUser;
import com.c203.altteulbe.user.persistent.entity.User;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

	private final JPAQueryFactory jpaQueryFactory;

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

	@Override
	public Optional<User> findByUsername(String username) {
		return Optional.ofNullable(jpaQueryFactory
			.selectFrom(QUser.user)
			.where(QUser.user.username.eq(username))
			.fetchOne()
		);
	}

	@Override
	public Optional<User> findByProviderAndUsername(User.Provider provider, String username) {
		System.out.println(provider);
		return Optional.ofNullable(jpaQueryFactory
			.selectFrom(QUser.user)
			.where(QUser.user.username.eq(username)
				.and(QUser.user.provider.eq(provider)))
			.fetchOne()
		);
	}
}