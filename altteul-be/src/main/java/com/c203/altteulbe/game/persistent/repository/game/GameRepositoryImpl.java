package com.c203.altteulbe.game.persistent.repository.game;

import static com.c203.altteulbe.game.persistent.entity.QGame.*;
import static com.c203.altteulbe.game.persistent.entity.item.QItemHistory.*;
import static com.c203.altteulbe.room.persistent.entity.QSingleRoom.*;
import static com.c203.altteulbe.room.persistent.entity.QTeamRoom.*;
import static com.c203.altteulbe.room.persistent.entity.QUserTeamRoom.*;
import static com.c203.altteulbe.user.persistent.entity.QUser.*;

import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.entity.QProblem;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class GameRepositoryImpl extends QuerydslRepositorySupport implements GameRepository {
	private final JPAQueryFactory queryFactory;

	public GameRepositoryImpl(JPAQueryFactory queryFactory) {
		super(Game.class);
		this.queryFactory = queryFactory;
	}

	@Override
	public Page<Game> findWithItemAndProblemAndAllMemberByUserId(Long userId, Pageable pageable) {
		QProblem problem = QProblem.problem;
		JPAQuery<Game> query = queryFactory
			.selectFrom(game)
			.join(game.teamRooms, teamRoom) // Game과 TeamRoom을 join
			.join(teamRoom.userTeamRooms, userTeamRoom) // TeamRoom과 UserTeamRoom을 join
			.join(userTeamRoom.user, user) // UserTeamRoom과 User를 join
			.where(user.userId.eq(userId)) // 특정 userId로 필터링
			.leftJoin(game.singleRooms, singleRoom) // SingleRoom을 left join하고 즉시 로딩
			.leftJoin(teamRoom.itemHistories, itemHistory) // ItemHistory를 left join하고 즉시 로딩
			.leftJoin(game.problem, problem) // Problem을 left join하고 즉시 로딩
			.orderBy(game.createdAt.asc()); // Game의 createdAt을 기준으로 오름차순 정렬

		JPAQuery<Long> countQuery = queryFactory
			.select(user.count())
			.from(user)
			.leftJoin(userTeamRoom).on(userTeamRoom.user.eq(user))
			.leftJoin(singleRoom).on(singleRoom.user.eq(user))
			.where(user.userId.eq(userId));


		List<Game> games = Objects.requireNonNull(getQuerydsl())
			.applyPagination(pageable, query)
			.fetch();

		return PageableExecutionUtils.getPage(games, pageable, countQuery::fetchOne);

	}
}
