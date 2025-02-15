package com.c203.altteulbe.game.web.dto.result.request;

import com.c203.altteulbe.common.dto.BattleType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OpponentCodeRequestDto {
	private BattleType type;
}
