package com.c203.altteulbe.editor.web.dto.request;

import com.c203.altteulbe.common.dto.BattleType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EditorRequestDto {
	private BattleType type;

	private String content;
}
