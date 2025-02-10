package com.c203.altteulbe.game.persistent.repository.item;

import static com.c203.altteulbe.game.persistent.entity.item.QItemHistory.*;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.game.persistent.entity.item.ItemHistory;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ItemHistoryRepositoryImpl implements ItemHistoryCustomRepository {
	private final JPAQueryFactory queryFactory;

	@Override
	public Boolean existsUnusedItemByGameIdAndTeamIdAndItemId(Long gameId, Long teamId, Long itemId) {
		return queryFactory
					.selectOne()
					.from(itemHistory)
					.where(
						itemHistory.game.id.eq(gameId),
						itemHistory.teamRoom.eq(teamId),
						itemHistory.item.id.eq(itemId)
					)
					.groupBy(itemHistory.game.id, itemHistory.teamRoom, itemHistory.item.id)
					.having(
						itemHistory.type.eq(ItemHistory.Type.H),
						itemHistory.type.ne(ItemHistory.Type.U)
					)
					.fetchFirst() != null;
	}
}
