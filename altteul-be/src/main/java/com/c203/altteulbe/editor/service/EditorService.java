package com.c203.altteulbe.editor.service;

import java.util.Base64;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.editor.persistent.entity.Editor;
import com.c203.altteulbe.editor.persistent.repository.EditorRepository;
import com.c203.altteulbe.editor.service.exception.NotFoundEditorException;
import com.c203.altteulbe.editor.web.dto.response.EditorResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EditorService {
	private final EditorRepository editorRepository;
	private final RedisTemplate<String, String> redisTemplate;

	public EditorResponseDto getEditor(String editorId) {

		// redis에서 조회
		String cachedState = redisTemplate.opsForValue().get(RedisKeys.getEditorKey(editorId));
		if (cachedState != null) {
			// Base64 디코딩
			byte[] content = Base64.getDecoder().decode(cachedState);
			return EditorResponseDto.builder()
				.editorId(editorId)
				.content(content)
				.build();
		}

		// DB 조회
		Editor editor = editorRepository.findById(editorId)
			.orElseThrow(NotFoundEditorException::new);

		// Redis 캐시 갱신 (Base64 인코딩)
		if (editor.getContent() != null) {
			String encodedContent = Base64.getEncoder().encodeToString(editor.getContent());
			redisTemplate.opsForValue().set(
				RedisKeys.getEditorKey(editorId),
				encodedContent,
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
		editor.updateContent(state);
	}
}
