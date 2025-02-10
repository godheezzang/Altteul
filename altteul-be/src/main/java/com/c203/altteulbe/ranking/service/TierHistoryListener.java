package com.c203.altteulbe.ranking.service;

import java.util.Objects;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

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
	 * [AFTER_COMMIT 옵션]
	 * @EventListener는 기본적으로 동기적으로 실행되므로 savePointHistory()와 같은 트랜잭션 내에서 실행됨
     * 따라서 트랜잭션이 완료되지 않으면 PointHistory가 아직 DB에 반영되지 않았을 수 있기 때문에
     * 트랜잭션 commit 이후 이벤트가 실행되도록 해야 함
	 */
	@EventListener
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handlePointHistorySaved(PointHistorySavedEvent event) {
		log.info("이벤트 실행");
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
			log.info("return");
			return;
		}

		// 티어에 변화가 있는 경우 업데이트
		TierHistory tierHistory = TierHistory.create(user, prevPoint, newPoint, newTier);
		tierHistoryRepository.save(tierHistory);
		user.updateTier(newTier);
		log.info("티어 업데이트 완료");
	}

	// 변동된 포인트에 속하는 티어 찾기
	public Tier calculateTier(Long newPoint) {
		Tier tier = tierRepository.findTierByPoint(newPoint);
		if (tier != null) {
			return tier;
		}
		return tierRepository.getHighestTier();
	}
}
