package com.c203.altteulbe.game.service.exception;

import org.springframework.http.HttpStatus;

import com.c203.altteulbe.common.exception.BusinessException;

public class NotEnoughUserException extends BusinessException {
	public NotEnoughUserException() {
		super("인원수가 부족합니다.", HttpStatus.BAD_REQUEST);
	}
}
