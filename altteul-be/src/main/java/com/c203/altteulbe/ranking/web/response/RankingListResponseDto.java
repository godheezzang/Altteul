package com.c203.altteulbe.ranking.web.response;

import com.c203.altteulbe.common.dto.Language;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RankingListResponseDto {
	private int rank;
	private int rankChange;
	private int rankingPoint;
	private Language language;
	private double avgWinRate;
}
