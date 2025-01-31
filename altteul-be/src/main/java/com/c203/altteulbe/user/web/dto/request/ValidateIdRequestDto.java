package com.c203.altteulbe.user.web.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ValidateIdRequestDto {
	@NotNull(message = "Username is required")
	private final String username;
}
