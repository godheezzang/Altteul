package com.c203.altteulbe.game.web.dto.result.response;

import java.util.List;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.game.persistent.entity.Game;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class GameResultResponseDto {
	private BattleType gameType;
	private String startedAt;
	private int totalHeadCount;
	private TeamInfo myTeam;
	private List<TeamInfo> opponents;

	public static GameResultResponseDto from(Game game, TeamInfo myTeam, List<TeamInfo> opponents) {
		if (game.getBattleType() == BattleType.S) {
			return GameResultResponseDto.builder()
					.gameType(game.getBattleType())
					.totalHeadCount(opponents.size()+1)
					.startedAt(String.valueOf(game.getCreatedAt()))
					.myTeam(myTeam)
					.opponents(opponents)
					.build();
		}
		else {
			return GameResultResponseDto.builder()
					.gameType(game.getBattleType())
					.totalHeadCount(myTeam.getTotalHeadCount() + opponents.get(0).getTotalHeadCount())
					.startedAt(String.valueOf(game.getCreatedAt()))
					.myTeam(myTeam)
					.opponents(opponents)
					.build();
		}
	}
}
