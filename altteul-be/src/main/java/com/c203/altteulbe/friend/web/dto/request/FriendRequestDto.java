package com.c203.altteulbe.friend.web.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestDto {

	@NotNull
	private Long fromUserId;

	@NotNull
	private Long toUserId;
}
