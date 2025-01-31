package com.c203.altteulbe.user.web.dto.request;

import com.c203.altteulbe.common.dto.AbstractRequestDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDto implements AbstractRequestDto {
	String id;
	String password;
}
