package com.c203.altteulbe.ranking.batch;

import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import com.c203.altteulbe.ranking.persistent.entity.RankingHistory;
import com.c203.altteulbe.ranking.persistent.repository.ranking_history.RankingHistoryRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RankingHistoryItemWriter implements ItemWriter<RankingHistory> {

	private final RankingHistoryRepository rankingHistoryRepository;

	@Override
	public void write(Chunk<? extends RankingHistory> chunk) throws Exception {
		rankingHistoryRepository.saveAll(chunk.getItems());
	}
}
