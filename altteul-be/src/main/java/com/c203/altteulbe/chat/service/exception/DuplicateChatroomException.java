package com.c203.altteulbe.chat.service.exception;

import org.springframework.http.HttpStatus;

import com.c203.altteulbe.common.exception.BusinessException;

public class DuplicateChatroomException extends BusinessException {
	public DuplicateChatroomException() {
		super("채팅방이 이미 있습니다.", HttpStatus.BAD_REQUEST);
	}
}
