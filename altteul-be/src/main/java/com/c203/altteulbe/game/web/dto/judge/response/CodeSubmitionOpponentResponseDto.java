package com.c203.altteulbe.game.web.dto.judge.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeSubmitionOpponentResponseDto {
	private String status;
	private int passCount;
	private int totalCount;

	// public static CodeSubmitionOpponentResponseDto from(JudgeResponse result) {
	// }
}
