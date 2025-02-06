package com.c203.altteulbe.user.web.dto.response;

import com.c203.altteulbe.common.dto.AbstractDto;
import com.c203.altteulbe.user.persistent.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponseDto implements AbstractDto {
	Long userId;
	String username;
	String nickname;
	String profileImg;
	String tier;
	int rankPercentile;
	int rank;
	int rankChange;

	public static UserProfileResponseDto from(User user) {
		return UserProfileResponseDto.builder()
			.userId(user.getUserId())
			.username(user.getUsername())
			.nickname(user.getNickname())
			.profileImg(user.getProfileImg())
			.tier(user.getTier().getTierName())
			// .rankPercentile()
			// .rank()
			// .rankChange()
			.build();
	}
}
