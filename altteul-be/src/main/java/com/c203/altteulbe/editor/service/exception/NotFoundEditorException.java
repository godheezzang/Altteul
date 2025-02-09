package com.c203.altteulbe.editor.service.exception;

import org.springframework.http.HttpStatus;

import com.c203.altteulbe.common.exception.BusinessException;

public class NotFoundEditorException extends BusinessException {
	public NotFoundEditorException() {
		super("Editor를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
	}
}
