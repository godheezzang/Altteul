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
	private Long friendRequestId;

	@NotNull
	private Long fromUserId;

	@NotNull
	private String fromUserNickname;

	@NotNull
	private String fromUserProfileImg;

	@NotNull
	private RequestStatus requestStatus;

	public static FriendRequestResponseDto from(FriendRequest friendRequest) {
		return FriendRequestResponseDto.builder()
			.friendRequestId(friendRequest.getFriendRequestId())
			.fromUserId(friendRequest.getFrom().getUserId())
			.fromUserNickname(friendRequest.getFrom().getNickname())
			.fromUserProfileImg(friendRequest.getFrom().getProfileImg())
			.requestStatus(friendRequest.getRequestStatus())
			.build();
	}
}
