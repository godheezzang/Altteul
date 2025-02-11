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
	private String token; // OpenVide 연결 토큰
	private String sessionId; // 세션 Id
	private Set<ParticipantResponseDto> participants; // 현재 참가자 목록
}
