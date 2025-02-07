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
			.join(game.teamRooms, teamRoom) // Game과 TeamRoom을 join
			.join(teamRoom.userTeamRooms, userTeamRoom) // TeamRoom과 UserTeamRoom을 join
			.join(userTeamRoom.user, user) // UserTeamRoom과 User를 join
			.where(user.userId.eq(userId)) // 특정 userId로 필터링
			.leftJoin(game.singleRooms, singleRoom) // SingleRoom을 left join하고 즉시 로딩
			.leftJoin(teamRoom.itemHistories, itemHistory) // ItemHistory를 left join하고 즉시 로딩
			.leftJoin(game.problem, problem) // Problem을 left join하고 즉시 로딩
			.orderBy(game.createdAt.asc()) // Game의 createdAt을 기준으로 오름차순 정렬
			.fetch(); // 결과 반환

	}
}
