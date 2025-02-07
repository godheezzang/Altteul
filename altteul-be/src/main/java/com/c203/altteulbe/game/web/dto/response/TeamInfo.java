package com.c203.altteulbe.game.web.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamInfo {
	private int gameResult;
	private String lang;
	private int totalHeadCount;
	private int executeTime;
	private int executeMemory;
	private Integer bonusPoint;
	private String duration;
	private String code;
	private List<TeamMember> members;

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class TeamMember {
		private Long userId;
		private String nickname;
		private String profileImage;
		private int rank;
	}
}