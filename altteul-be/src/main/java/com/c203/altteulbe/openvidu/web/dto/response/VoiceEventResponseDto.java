package com.c203.altteulbe.openvidu.web.dto.response;

import com.c203.altteulbe.common.dto.VoiceEventType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoiceEventResponseDto {
	private String userId;
	private Long teamId;
	private VoiceEventType type;
	// true: 활성 상태 (입장, 마이크 켜짐)
	// false: 비활성 상태 (퇴장, 마이크 꺼짐)
	private boolean status;
}
