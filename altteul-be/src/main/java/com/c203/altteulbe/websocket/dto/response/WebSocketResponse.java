package com.c203.altteulbe.websocket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WebSocketResponse<T> {
	private String type;
	private T data;

	public static WebSocketResponse<String> withMessage(String type, String message) {
		return new WebSocketResponse<>(type, message);
	}

	public static <T> WebSocketResponse<T> withData(String type, T data) {
		return new WebSocketResponse<>(type, data);
	}
}
