package com.c203.altteulbe.openvidu.web.dto.reqeust;

import com.c203.altteulbe.common.dto.VoiceEventType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoiceEventRequestDto {
	private String userId;
	private VoiceEventType type;
	private boolean status;
	private String message;
}
