package com.c203.altteulbe.friend.web.dto.response;

import com.c203.altteulbe.common.dto.RequestStatus;
import com.c203.altteulbe.friend.persistent.entity.FriendRequest;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendRequestResponseDto {

	@NotNull
	public Long id;

	@NotNull
	public Long fromUserId;

	@NotNull
	public String fromUserNickname;

	@NotNull
	public String fromUserProfileImg;

	@NotNull
	public RequestStatus requestStatus;

	public static FriendRequestResponseDto from(FriendRequest friendRequest) {
		return new FriendRequestResponseDto(
			friendRequest.getId(),
			friendRequest.getFrom().getUserId(),
			friendRequest.getFrom().getNickname(),
			friendRequest.getFrom().getProfileImg(),
			friendRequest.getRequestStatus()
		);
	}
}
