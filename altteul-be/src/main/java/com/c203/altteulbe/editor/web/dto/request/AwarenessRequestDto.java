package com.c203.altteulbe.editor.web.dto.request;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AwarenessRequestDto {

	private Map<String, Object> awareness;
}
