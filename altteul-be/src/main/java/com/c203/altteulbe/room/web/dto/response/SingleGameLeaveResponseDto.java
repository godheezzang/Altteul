package com.c203.altteulbe.room.web.dto.response;

import java.util.List;

import com.c203.altteulbe.user.web.dto.response.UserInfoResponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SingleGameLeaveResponseDto {
	private Long gameId;
	private Long roomId;
	private UserInfoResponseDto leftUser;
	private List<UserInfoResponseDto> remainingUsers;
}
