package com.c203.altteulbe.room.web.dto.response;

import java.util.List;

import com.c203.altteulbe.game.web.dto.response.GameStartForProblemDto;
import com.c203.altteulbe.game.web.dto.response.GameStartForTestcaseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamRoomGameStartResponseDto {
	private Long gameId;
	private RoomEnterResponseDto team1;
	private RoomEnterResponseDto team2;
	private GameStartForProblemDto problem;
	private List<GameStartForTestcaseDto> testcases;

	public static TeamRoomGameStartResponseDto from(Long gameId,
											RoomEnterResponseDto team1,
											RoomEnterResponseDto team2,
											GameStartForProblemDto problem,
											List<GameStartForTestcaseDto> testcase) {
		return TeamRoomGameStartResponseDto.builder()
								.gameId(gameId)
								.team1(team1)
								.team2(team2)
								.problem(problem)
								.testcases(testcase)
								.build();
	}
}
