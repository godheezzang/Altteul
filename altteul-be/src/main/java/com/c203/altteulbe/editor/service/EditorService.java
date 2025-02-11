package com.c203.altteulbe.editor.service;

import org.springframework.stereotype.Service;

import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.repository.game.GameRepository;
import com.c203.altteulbe.room.persistent.entity.TeamRoom;
import com.c203.altteulbe.room.persistent.repository.team.TeamRoomRepository;
import com.c203.altteulbe.room.service.exception.RoomNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EditorService {
	private final GameRepository gameRepository;
	private final TeamRoomRepository teamRoomRepository;

	public Long getEnemyRoomId(Long roomId) {
		// roomId로 해당 게임의 양 팀 조회
		TeamRoom teamRoom = teamRoomRepository.findById(roomId).orElseThrow(RoomNotFoundException::new);
		Long gameId = teamRoom.getGame().getId();
		Game game = gameRepository.getReferenceById(gameId);
		return game.getTeamRooms()
			.stream()
			.map(TeamRoom::getId)
			.filter(id -> !id.equals(roomId))
			.findFirst()
			.orElseThrow(RoomNotFoundException::new);
	}
}
