package com.c203.altteulbe.editor.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EditorRequestDto {

	private String editorId;

	private byte[] content;
}
