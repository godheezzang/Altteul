package com.c203.altteulbe.game.web.dto.result.response;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.c203.altteulbe.common.dto.Language;
import com.c203.altteulbe.room.persistent.entity.SingleRoom;
import com.c203.altteulbe.room.persistent.entity.TeamRoom;
import com.c203.altteulbe.room.persistent.entity.UserTeamRoom;
import com.c203.altteulbe.user.persistent.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamInfo {
	private Long teamId;
	private int gameResult;
	private Language lang;
	private int totalHeadCount;
	private String executeTime;
	private String executeMemory;
	private Integer point;
	private int passRate;
	private String duration;
	private String code;
	private LocalDateTime createdAt;
	private List<TeamMember> members;

	public static TeamInfo fromTeamRoom(TeamRoom room, int totalCount) {
		String duration;
		if (room.getFinishTime() == null && room.isActivation()) {
			duration = "진행중";
		} else if (room.getFinishTime() == null && !room.isActivation()) {
			duration = "종료";
		} else {
			duration = fromDurationToMinuteAndSecond(Duration.between(room.getCreatedAt(), room.getFinishTime()));
		}
		return TeamInfo.builder()
			.teamId(room.getId())
			.gameResult(room.getBattleResult().getRank())
			.lang(room.getLang())
			.totalHeadCount(room.getUserTeamRooms().size())
			.executeTime(room.getLastExecuteTime())
			.executeMemory(room.getLastExecuteMemory())
			.point(room.getRewardPoint())
			.passRate(room.getSolvedTestcaseCount()/totalCount*100)
			.duration(duration)
			.code(room.getCode())
			.createdAt(room.getCreatedAt()) // 정렬용 필드
			.members(room.getUserTeamRooms().stream()
				.map(TeamMember::fromUserTeamRoom)
				.collect(Collectors.toList()))
			.build();
	}

	// TeamRoom 변환 메서드
	public static TeamInfo fromSingleRoom(SingleRoom room, int totalCount) {
		String duration;
		if (room.getFinishTime() == null && room.isActivation()) {
			duration = "진행중";
		} else if (room.getFinishTime() == null && !room.isActivation()) {
			duration = "종료";
		} else {
			duration = fromDurationToMinuteAndSecond(Duration.between(room.getCreatedAt(), room.getFinishTime()));
		}
		return TeamInfo.builder()
			.teamId(room.getId())
			.gameResult(room.getBattleResult().getRank())
			.lang(room.getLang())
			.totalHeadCount(1)
			.executeTime(room.getLastExecuteTime())
			.executeMemory(room.getLastExecuteMemory())
			.point(room.getRewardPoint())
			.passRate(room.getSolvedTestcaseCount()/totalCount*100)
			.duration(duration)
			.code(room.getCode())
			.createdAt(room.getCreatedAt()) // 정렬용 필드
			.members(Collections.singletonList( // 개인방 유저 1명만
				TeamMember.fromUser(room.getUser())
			))
			.build();
	}

	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class TeamMember {
		private Long userId;
		private String nickname;
		private String profileImage;
		private Long tierId;

		public static TeamMember fromUserTeamRoom(UserTeamRoom userTeamRoom) {
			return TeamMember.builder()
				.userId(userTeamRoom.getUser().getUserId())
				.nickname(userTeamRoom.getUser().getNickname())
				.profileImage(userTeamRoom.getUser().getProfileImg())
				.tierId(userTeamRoom.getUser().getTier().getId())
				.build();
		}

		public static TeamMember fromUser(User user) {
			return TeamMember.builder()
				.userId(user.getUserId())
				.nickname(user.getNickname())
				.profileImage(user.getProfileImg())
				.tierId(user.getTier().getId())
				.build();
		}
	}

	private static String fromDurationToMinuteAndSecond(Duration duration) {
		long totalSeconds = duration.getSeconds();
		long hours = totalSeconds / 3600;
		long minutes = (totalSeconds % 3600) / 60;
		long seconds = totalSeconds % 60;

		if (hours == 0) {
			return String.format("%02d:%02d", minutes, seconds); // 분:초 포맷
		} else {
			return String.format("%02d:%02d:%02d", hours, minutes, seconds); // 시:분:초 포맷
		}
	}
}
