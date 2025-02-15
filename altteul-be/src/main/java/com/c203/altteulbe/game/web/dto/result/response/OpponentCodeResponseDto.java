package com.c203.altteulbe.game.web.dto.result.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OpponentCodeResponseDto {
	private String nickname;
	private Long roomId;
	private String code;
}
