package com.c203.altteulbe.room.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class TeamMatchResponseDto {
	private RoomEnterResponseDto team1;
	private RoomEnterResponseDto team2;

	public static TeamMatchResponseDto toDto(RoomEnterResponseDto team1, RoomEnterResponseDto team2) {
		return TeamMatchResponseDto.builder()
								   .team1(team1)
								   .team2(team2)
							       .build();
	}
}
