package com.c203.altteulbe.game.persistent.repository.game;

import static com.c203.altteulbe.game.persistent.entity.QGame.*;
import static com.c203.altteulbe.game.persistent.entity.item.QItemHistory.*;
import static com.c203.altteulbe.room.persistent.entity.QSingleRoom.*;
import static com.c203.altteulbe.room.persistent.entity.QTeamRoom.*;
import static com.c203.altteulbe.room.persistent.entity.QUserTeamRoom.*;
import static com.c203.altteulbe.user.persistent.entity.QUser.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.entity.QProblem;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class GameRepositoryImpl implements GameRepository {
	private final JPAQueryFactory queryFactory;
	@Override
	public List<Game> findWithItemAndProblemAndAllMemberByUserId(Long userId) {
		QProblem problem = QProblem.problem;
		return queryFactory
			.selectFrom(game)
			.join(game.teamRooms, teamRoom)
			.join(teamRoom.userTeamRooms, userTeamRoom)
			.join(userTeamRoom.user, user)
			.where(user.userId.eq(userId))
			.leftJoin(game.singleRooms, singleRoom).fetchJoin()
			.leftJoin(game.itemHistories, itemHistory).fetchJoin()
			.leftJoin(game.problem, problem).fetchJoin()
			.orderBy(game.createdAt.asc())
			.fetch();
	}
}
