package com.c203.altteulbe.ranking.batch;

import java.util.List;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import com.c203.altteulbe.ranking.persistent.entity.RankingHistory;
import com.c203.altteulbe.ranking.persistent.repository.ranking_history.RankingHistoryRepository;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserRepository;

@Component
public class RankingHistoryItemProcessor implements ItemProcessor<User, RankingHistory> {

	private final RankingHistoryRepository rankingHistoryRepository;
	private final UserRepository userRepository;

	// UserRepository, UserJPARepository, UserRepositoryImpl 구조로 인한 bean 주입 문제가 발생하여 @Qualifier 사용
	public RankingHistoryItemProcessor(
										RankingHistoryRepository rankingHistoryRepository,
										@Qualifier("userRepositoryImpl") UserRepository userRepository) {
		this.rankingHistoryRepository = rankingHistoryRepository;
		this.userRepository = userRepository;
	}

	@Override
	public RankingHistory process(User user) {

		// 전날 랭킹 정보 조회
		RankingHistory yesterdayRanking = rankingHistoryRepository.findLatestByUser(user.getUserId());

		// 전날 데이터가 없는 경우 (첫 랭킹 기록)
		if (yesterdayRanking == null) {
			int totalUsers = (int) userRepository.countUsers();
			return RankingHistory.create(user, user.getTier(),
										 user.getRankingPoint(), totalUsers, 0);
		}

		// 현재 유저의 랭킹 찾기
		List<User> rankedUsers = userRepository.findAllOrderedByRankingPointTierUsername();
		int currentRanking = 1;
		for (User rankedUser : rankedUsers) {
			if (rankedUser.getUserId().equals(user.getUserId())) {
				break;
			}
			currentRanking++;
		}

		// 랭킹 변화 계산
		int rankingChange = yesterdayRanking.getRanking() - currentRanking;

		return RankingHistory.create(user, user.getTier(),
									 user.getRankingPoint(), currentRanking, rankingChange);

	}
}
