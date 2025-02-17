package com.c203.altteulbe.editor.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EditorResponseDto {

	private Long roomId;

	private Long userId;

	private String content;
}
