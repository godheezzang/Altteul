package com.c203.altteulbe.game.web.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class SubmitCodeRequest {
	@NotBlank String code;
	@NotBlank String language;
	@NotBlank String problemId;
}
