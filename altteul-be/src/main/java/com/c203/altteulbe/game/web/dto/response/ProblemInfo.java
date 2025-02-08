package com.c203.altteulbe.game.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemInfo {
	Long problemId;
	String problemTitle;
	String problemContent;
}
