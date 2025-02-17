package com.c203.altteulbe.editor.web.dto.response;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AwarenessResponseDto {

	private Long roomId;

	private Long userId;

	private Map<String, Object> awareness;
}
