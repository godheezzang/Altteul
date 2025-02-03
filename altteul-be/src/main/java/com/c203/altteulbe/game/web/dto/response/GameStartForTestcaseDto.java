package com.c203.altteulbe.game.web.dto.response;

import com.c203.altteulbe.game.persistent.entity.Testcase;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameStartForTestcaseDto {
	private Long testcaseId;
	private int number;
	private String input;
	private String output;

	public static GameStartForTestcaseDto from(Testcase testcase) {
		return GameStartForTestcaseDto.builder()
								.testcaseId(testcase.getId())
								.number(testcase.getNumber())
								.input(testcase.getInput())
								.output(testcase.getOutput())
								.build();
	}
}
