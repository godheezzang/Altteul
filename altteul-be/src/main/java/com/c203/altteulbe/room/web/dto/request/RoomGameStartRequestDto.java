package com.c203.altteulbe.room.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomGameStartRequestDto {
	private Long roomId;
	private Long leaderId;
}
