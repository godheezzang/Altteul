package com.c203.altteulbe.room.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SingleRoomRequestDto {
	private Long userId;

	public static SingleRoomRequestDto toDto(Long userId) {
		return SingleRoomRequestDto.builder()
								   .userId(userId)
								   .build();
	}
}
