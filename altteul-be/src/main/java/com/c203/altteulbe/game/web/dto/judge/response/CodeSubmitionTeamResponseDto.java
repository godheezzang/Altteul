package com.c203.altteulbe.game.web.dto.judge.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeSubmitionTeamResponseDto {
	private String status; // 채점 전체 결과 (예: "P": 합격)
	private List<TestCaseResult> testCases;
	private int passCount;
	private int totalCount;

	// public static CodeSubmitionTeamResponseDto from(JudgeResponse result) {
		// CodeSubmitionTeamResponseDto.builder()
		// 	.status("P")
		// 	.testCases(new List<TestCaseResult>() {
		// 	})
		// 	.passCount()
		// 	.totalCount()
		// 	.build();
	// }
}
