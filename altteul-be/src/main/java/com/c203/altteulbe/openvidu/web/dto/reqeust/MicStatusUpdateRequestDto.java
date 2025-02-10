package com.c203.altteulbe.openvidu.web.dto.reqeust;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MicStatusUpdateRequestDto {
	private Boolean isMuted;
}
