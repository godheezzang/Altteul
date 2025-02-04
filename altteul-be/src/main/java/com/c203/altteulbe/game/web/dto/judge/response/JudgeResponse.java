package com.c203.altteulbe.game.web.dto.judge.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class JudgeResponse {
	private String err;
	private Object data;
}
