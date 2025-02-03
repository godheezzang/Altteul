package com.c203.altteulbe.friend.web.dto.response;

import com.c203.altteulbe.friend.persistent.entity.Friendship;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@Getter
@NoArgsConstructor
public class FriendResponseDto {

	@NotNull
	private Long userid;

	@NotNull(message = "Nickname is required")
	private String nickname;

	private String profileImg;

	private Boolean isOnline;

	public static FriendResponseDto from(Friendship friendship, boolean isOnline) {
		return FriendResponseDto.builder()
			.userid(friendship.getFriend().getUserId())
			.nickname(friendship.getFriend().getNickname())
			.profileImg(friendship.getFriend().getProfileImg())
			.isOnline(isOnline)
			.build();

	}
}
