package com.c203.altteulbe.friend.web.dto.response;

import com.c203.altteulbe.friend.persistent.entity.Friend;

public record FriendResponseDto(
	Long id,
	String nickname,
	String profileImg,
	Boolean isOnline
) {
	public static FriendResponseDto from(Friend friend, boolean isOnline) {
		return new FriendResponseDto(
			friend.getFriend().getUserId(),
			friend.getFriend().getNickname(),
			friend.getFriend().getProfileImg(),
			isOnline
		);
	}
}
