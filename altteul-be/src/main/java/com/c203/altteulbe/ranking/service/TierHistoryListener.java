package com.c203.altteulbe.ranking.service;

import java.util.Objects;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.c203.altteulbe.game.persistent.entity.PointHistory;
import com.c203.altteulbe.game.persistent.repository.history.TierHistoryRepository;
import com.c203.altteulbe.game.service.PointHistorySavedEvent;
import com.c203.altteulbe.ranking.persistent.entity.Tier;
import com.c203.altteulbe.ranking.persistent.entity.TierHistory;
import com.c203.altteulbe.ranking.persistent.repository.TierRepository;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/*
 * PointHistorySavedEvent를 감지하여 티어에 변화가 있는 경우 TierHistory 업데이트
 */

@Slf4j
@Component
@RequiredArgsConstructor
public class TierHistoryListener {

	private final TierHistoryRepository tierHistoryRepository;
	private final UserJPARepository userJPARepository;
	private final TierRepository tierRepository;

	/*
	 * 이벤트 리스너 실행 중 에러가 발생하더라도 PointHistory의 트랜잭션에
	 * 영향을 주지 않기 위해 REQUIRES_NEW 옵션 지정
	 */
	@EventListener
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void handlePointHistorySaved(PointHistorySavedEvent event) {
		PointHistory pointHistory = event.getPointHistory();
		User user = pointHistory.getUser();

		// 유저의 현재 랭킹 포인트
		Long prevPoint = user.getRankingPoint();

		// 포인트 업데이트
		Long newPoint = prevPoint + pointHistory.getPoint();
		user.updateRankingPoint(newPoint);

		// 티어 변경 여부 확인 : 티어에 변화가 없는 경우 업데이트 불필요
		Tier prevTier = user.getTier();
		Tier newTier = calculateTier(newPoint);

		if (prevTier.getTierName().equals(newTier.getTierName())) {
			return;
		}

		// 티어에 변화가 있는 경우 업데이트
		TierHistory tierHistory = TierHistory.create(user, prevPoint, newPoint, newTier);
		tierHistoryRepository.save(tierHistory);
		user.updateTier(newTier);
		log.info("Tier 변동 이벤트 발생");
	}


	public Tier calculateTier(Long newPoint) {
		Tier tier = tierRepository.findTierByPoint(newPoint);
		return (tier != null) ? tier : tierRepository.getHighestTier();
	}
}
