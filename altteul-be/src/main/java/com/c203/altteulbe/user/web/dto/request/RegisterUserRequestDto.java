package com.c203.altteulbe.user.web.dto.request;

import com.c203.altteulbe.common.dto.AbstractRequestDto;
import com.c203.altteulbe.common.dto.Language;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RegisterUserRequestDto implements AbstractRequestDto {

	@NotNull(message = "Username is required")
	private final String username;

	@NotNull(message = "Password is required")
	@Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
	private final String password;

	@NotNull(message = "Nickname is required")
	private final String nickname;

	@NotNull(message = "Main language is required")
	private final Language mainLang;
}