package com.c203.altteulbe.room.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomRequestDto {
	private Long userId;

	public static RoomRequestDto toDto(Long userId) {
		return RoomRequestDto.builder()
								   .userId(userId)
								   .build();
	}
}
