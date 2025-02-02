package com.c203.altteulbe.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WebSocketResponse<T> {
	private String message;
	private T data;
}
