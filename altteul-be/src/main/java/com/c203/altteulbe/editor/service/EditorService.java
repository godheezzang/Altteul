package com.c203.altteulbe.editor.service;

import java.util.Base64;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.editor.persistent.entity.Editor;
import com.c203.altteulbe.editor.persistent.repository.EditorRepository;
import com.c203.altteulbe.editor.service.exception.NotFoundEditorException;
import com.c203.altteulbe.editor.web.dto.response.EditorResponseDto;
import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.repository.game.GameJPARepository;
import com.c203.altteulbe.room.persistent.entity.SingleRoom;
import com.c203.altteulbe.room.persistent.entity.TeamRoom;
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRepository;
import com.c203.altteulbe.room.persistent.repository.team.TeamRoomRepository;
import com.c203.altteulbe.room.service.exception.RoomNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EditorService {
	private final EditorRepository editorRepository;
	private final RedisTemplate<String, String> redisTemplate;
	private final GameJPARepository gameJPARepository;
	private final TeamRoomRepository teamRoomRepository;
	private final SingleRoomRepository singleRoomRepository;

	public EditorResponseDto getEditor(String editorId) {

		// redis에서 조회
		String cachedState = redisTemplate.opsForValue().get(RedisKeys.getEditorKey(editorId));
		if (cachedState != null) {
			return EditorResponseDto.builder()
				.editorId(editorId)
				.content(cachedState)
				.build();
		}

		// DB 조회
		Editor editor = editorRepository.findById(editorId)
			.orElseThrow(NotFoundEditorException::new);

		// Redis 캐시 갱신
		if (editor.getContent() != null) {
			redisTemplate.opsForValue().set(
				RedisKeys.getEditorKey(editorId),
				editor.getContent(),
				3,
				TimeUnit.HOURS
			);
		}
		return EditorResponseDto.builder()
			.editorId(editorId)
			.content(editor.getContent())
			.build();
	}

	// db에 상태 저장
	@Transactional
	public void saveState(String editorId, byte[] state) {

		// byte -> string
		// redistemplate가 <String, String>이기 때문에
		String encodedState = Base64.getEncoder().encodeToString(state);

		// 3시간 동안 상태 저장
		redisTemplate.opsForValue().set(RedisKeys.getEditorKey(editorId), encodedState, 3, TimeUnit.HOURS);

		// DB에 저장
		// JPA의 더티 체킹(Dirty Checking)
		// @Transactional이 붙은 메서드 내에서 엔티티의 값을 변경하면,
		// 트랜잭션이 종료될 때 변경감지(Dirty Checking)가 동작하여 자동으로 UPDATE 쿼리가 실행
		Editor editor = editorRepository.findById(editorId).orElseThrow(NotFoundEditorException::new);
		editor.updateContent(encodedState);

		// Room code 업데이트
		String[] parts = editorId.split(":");
		BattleType type = BattleType.valueOf(parts[0].toUpperCase());
		Long roomId = Long.parseLong(parts[1]);

		// Base64 디코딩 - Room에는 일반 텍스트로 저장
		String decodedContent = new String(state);

		if (type == BattleType.S) {
			SingleRoom singleRoom = singleRoomRepository.findById(roomId)
				.orElseThrow(RoomNotFoundException::new);
			singleRoom.updateSubmissionRecord(
				singleRoom.getSolvedTestcaseCount(),
				singleRoom.getLastExecuteTime(),
				singleRoom.getLastExecuteMemory(),
				decodedContent
			);
		} else {
			TeamRoom teamRoom = teamRoomRepository.findById(roomId)
				.orElseThrow(RoomNotFoundException::new);
			teamRoom.updateSubmissionRecord(
				teamRoom.getSolvedTestcaseCount(),
				teamRoom.getLastExecuteTime(),
				teamRoom.getLastExecuteMemory(),
				decodedContent
			);
		}
	}

	public String getEnemyTeamEditorId(Long roomId) {
		// roomId로 해당 게임의 양 팀 조회
		TeamRoom teamRoom = teamRoomRepository.findById(roomId).orElseThrow(RoomNotFoundException::new);
		Long gameId = teamRoom.getGame().getId();
		Game game = gameJPARepository.getReferenceById(gameId);
		Long enemyTeamRoomId = game.getTeamRooms()
			.stream()
			.map(TeamRoom::getId)
			.filter(id -> !id.equals(roomId))
			.findFirst()
			.orElseThrow(RoomNotFoundException::new);
		return "t:" + enemyTeamRoomId;
	}
}
