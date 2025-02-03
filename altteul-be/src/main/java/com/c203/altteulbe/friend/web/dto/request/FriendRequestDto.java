package com.c203.altteulbe.friend.web.dto.request;

import com.c203.altteulbe.common.dto.RequestStatus;

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
	private Long friendRequestId;

	@NotNull
	private Long fromUserId;

	@NotNull
	private Long toUserId;

	@NotNull
	private RequestStatus status;
}
