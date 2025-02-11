package com.c203.altteulbe.openvidu.web.dto.reqeust;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoiceChatRequestDto {
	private String userId;
}
