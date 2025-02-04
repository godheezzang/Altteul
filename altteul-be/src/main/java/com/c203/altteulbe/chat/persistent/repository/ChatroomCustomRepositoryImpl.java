package com.c203.altteulbe.chat.persistent.repository;

import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import com.c203.altteulbe.chat.persistent.entity.Chatroom;
import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class ChatroomCustomRepositoryImpl extends QuerydslRepositorySupport implements ChatroomCustomRepository {
	private final JPAQueryFactory queryFactory;

	public ChatroomCustomRepositoryImpl(JPAQueryFactory queryFactory) {
		super(Chatroom.class);
		this.queryFactory = queryFactory;
	}
}
