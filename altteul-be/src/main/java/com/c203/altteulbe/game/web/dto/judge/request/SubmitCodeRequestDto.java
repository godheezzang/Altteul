package com.c203.altteulbe.game.web.dto.judge.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class SubmitCodeRequestDto {
	@NotBlank String code;
	@NotBlank String language;
	@NotBlank String problemId;
}
