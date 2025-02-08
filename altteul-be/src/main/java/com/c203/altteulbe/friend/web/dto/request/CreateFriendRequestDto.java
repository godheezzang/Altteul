package com.c203.altteulbe.friend.web.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFriendRequestDto {

	@JsonProperty("toUserId")
	private Long toUserId;

}
