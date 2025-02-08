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
	String tierName;
	Long tierId;
	Long rankPercentile;
	Long rank;
	Long rankChange;
	Boolean isOwner;

	public static UserProfileResponseDto from(User user, Long totalCount, Long currentUserId) {
		Long rank;
		if (user.getTodayRanking() == null) rank = totalCount;
		else rank = user.getTodayRanking().getId();

		return UserProfileResponseDto.builder()
			.userId(user.getUserId())
			.username(user.getUsername())
			.nickname(user.getNickname())
			.profileImg(user.getProfileImg())
			.tierId(user.getTier().getId())
			.tierName(user.getTier().getTierName())
			.rankPercentile((user.getTodayRanking().getId()/totalCount)*100)
			.rank(rank)
			.rankChange(user.getTodayRanking().getRankingChange())
			.isOwner(user.getUserId().equals(currentUserId))
			.build();
	}

	public static UserProfileResponseDto from(User user, Long currentUserId) {
		return UserProfileResponseDto.builder()
			.userId(user.getUserId())
			.username(user.getUsername())
			.nickname(user.getNickname())
			.profileImg(user.getProfileImg())
			.tierId(user.getTier().getId())
			.tierName(user.getTier().getTierName())
			.isOwner(user.getUserId().equals(currentUserId))
			.build();
	}
}
