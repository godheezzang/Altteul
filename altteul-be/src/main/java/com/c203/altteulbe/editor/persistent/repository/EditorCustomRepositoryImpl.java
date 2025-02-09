package com.c203.altteulbe.editor.persistent.repository;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EditorCustomRepositoryImpl implements EditorCustomRepository {
	private final JPAQueryFactory queryFactory;

}
