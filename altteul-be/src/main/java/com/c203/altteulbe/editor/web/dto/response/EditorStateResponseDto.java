package com.c203.altteulbe.editor.web.dto.response;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EditorStateResponseDto {
	private String content;

	private Map<String, Object> awareness;

	private Long userId;
}
