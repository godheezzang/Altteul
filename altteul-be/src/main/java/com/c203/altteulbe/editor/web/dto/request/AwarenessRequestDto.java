package com.c203.altteulbe.editor.web.dto.request;

import com.c203.altteulbe.common.dto.BattleType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AwarenessRequestDto {
	private BattleType type;

	private String awareness;
}
