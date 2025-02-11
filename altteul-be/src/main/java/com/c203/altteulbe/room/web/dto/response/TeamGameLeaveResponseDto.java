package com.c203.altteulbe.room.web.dto.response;

import java.util.List;
import java.util.Map;

import com.c203.altteulbe.user.web.dto.response.UserInfoResponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeamGameLeaveResponseDto {
	private Long roomId;
	private UserInfoResponseDto leftUser; // 퇴장한 유저 정보
	private Map<Long, List<UserInfoResponseDto>> remainingUsers; // 전체 남은 유저들
}
