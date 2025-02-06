package com.c203.altteulbe.user.web.dto.response;

import com.c203.altteulbe.user.persistent.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchUserResponseDto {
	private Long userId;
	private String nickname;
	private String profileImg;

	public static SearchUserResponseDto from(User user) {
		return SearchUserResponseDto.builder()
			.userId(user.getUserId())
			.nickname(user.getNickname())
			.profileImg(user.getProfileImg())
			.build();
	}
}
