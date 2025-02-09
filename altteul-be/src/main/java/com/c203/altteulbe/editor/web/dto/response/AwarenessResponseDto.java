package com.c203.altteulbe.editor.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AwarenessResponseDto {

	private String editorId;

	private byte[] awareness;
}
