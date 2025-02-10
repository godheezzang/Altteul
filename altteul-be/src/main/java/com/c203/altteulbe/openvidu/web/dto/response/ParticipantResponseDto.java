package com.c203.altteulbe.openvidu.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParticipantResponseDto {
	private String userId;
	private boolean micEnabled;
	private boolean connected;
}
