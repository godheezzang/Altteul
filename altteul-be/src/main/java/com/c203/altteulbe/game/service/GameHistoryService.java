package com.c203.altteulbe.game.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.c203.altteulbe.common.response.PageResponse;
import com.c203.altteulbe.common.utils.PaginateUtil;
import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.repository.game.GameRepository;
import com.c203.altteulbe.game.web.dto.response.GameRecordResponseDto;
import com.c203.altteulbe.game.web.dto.response.ItemInfo;
import com.c203.altteulbe.game.web.dto.response.ProblemInfo;
import com.c203.altteulbe.game.web.dto.response.TeamInfo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameHistoryService {

	private final GameRepository gameRepository;

	public PageResponse<GameRecordResponseDto> getGameRecord(Long userId, Pageable pageable) {
		Page<Game> games = gameRepository.findWithItemAndProblemAndAllMemberByUserId(userId,
			PageRequest.of(pageable.getPageNumber(),
				pageable.getPageSize())
		);

		List<GameRecordResponseDto> gameRecordResponseDtos = new ArrayList<>();
 		for (Game game: games) {
			ProblemInfo problemInfo = ProblemInfo.builder()
				.problemId(game.getProblem().getId())
				.problemContent(game.getProblem().getDescription())
				.problemTitle(game.getProblem().getProblemTitle())
				.build();

			List<TeamInfo> teamInfos = extractTeamInfos(game);

			List<TeamInfo> opponents = new ArrayList<>();

			TeamInfo myTeam = teamInfos.stream()
				.filter(teamInfo -> teamInfo.getMembers().stream()
					.anyMatch(member -> member.getUserId().equals(userId))) // `anyMatch()`로 검사
				.findFirst()
				.orElse(null);

			opponents.add(
				teamInfos.stream()
				.filter(teamInfo -> teamInfo.getMembers().stream()
					.anyMatch(member -> !member.getUserId().equals(userId))) // `anyMatch()`로 검사
				.findFirst()
				.orElse(null)
			);
			List<ItemInfo> items;
			if (myTeam != null) items = ItemInfo.from(game, myTeam.getTeamId());
			else throw new NullPointerException();

			gameRecordResponseDtos.add(GameRecordResponseDto.from(game, problemInfo, items, myTeam, opponents));
		}

		Page<GameRecordResponseDto> paginateResult = PaginateUtil.paginate(gameRecordResponseDtos,
			pageable.getPageNumber(), pageable.getPageSize());
		return new PageResponse<>("games", paginateResult);
	}

	private static List<TeamInfo> extractTeamInfos(Game game) {
		// 팀방 정보 변환
		List<TeamInfo> teamRoomInfos = game.getTeamRooms().stream()
			.map(TeamInfo::fromTeamRoom)
			.toList();

		// 개인방 정보 변환 (TeamInfo 형식으로 변환)
		List<TeamInfo> singleRoomInfos = game.getSingleRooms().stream()
			.map(TeamInfo::fromSingleRoom)
			.toList();

		// 두 리스트 합치기 + createdAt 기준 정렬
		return Stream.concat(teamRoomInfos.stream(), singleRoomInfos.stream())
			.sorted(Comparator.comparing(TeamInfo::getCreatedAt))
			.collect(Collectors.toList());
	}
}
