package com.c203.altteulbe.friend.web.dto.response;

import com.c203.altteulbe.friend.persistent.entity.Friendship;

public record FriendResponseDto(
	Long id,
	String nickname,
	String profileImg,
	Boolean isOnline
) {
	public static FriendResponseDto from(Friendship friendship, boolean isOnline) {
		return new FriendResponseDto(
			friendship.getFriend().getUserId(),
			friendship.getFriend().getNickname(),
			friendship.getFriend().getProfileImg(),
			isOnline
		);
	}
}
