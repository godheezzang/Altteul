package com.c203.altteulbe.openvidu.web.dto.response;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoiceChatJoinResponseDto {
	private String token;
	private String sessionId;
	private Set<ParticipantResponseDto> participants;
}
