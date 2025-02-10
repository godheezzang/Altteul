package com.c203.altteulbe.editor.service.exception;

import org.springframework.http.HttpStatus;

import com.c203.altteulbe.common.exception.BusinessException;

public class EnemyTeamEditorIdNotFoundException extends BusinessException {
	public EnemyTeamEditorIdNotFoundException() {
		super("상대팀 에디터ID를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);

	}
}
