package com.c203.altteulbe.game.web.dto.response;

import java.util.List;

import com.c203.altteulbe.user.web.dto.response.UserInfoResponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class SingleRoomEnterResponseDto {
	private Long roomId;
	private Long leaderId;
	private List<UserInfoResponseDto> users;

	public static SingleRoomEnterResponseDto from(Long roomId, Long leaderId, List<UserInfoResponseDto> users) {
		return SingleRoomEnterResponseDto.builder()
										 .roomId(roomId)
									     .leaderId(leaderId)
									     .users(users)
										 .build();
	}


}
