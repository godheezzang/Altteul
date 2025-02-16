package com.c203.altteulbe.openvidu.interceptor;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.room.service.RoomValidator;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class VoiceChatInterceptor implements HandlerInterceptor {

	private final RoomValidator roomValidator;
	private final RedisTemplate<String, String> redisTemplate;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws
		Exception {
		if (request.getRequestURI().contains("/voice")) {
			Long roomId = extractRoomId(request); // roomId(PK)
			Long userId = extractUserId(request);
			log.info("roomId: {}, userId: {}", roomId, userId);
			String roomUUID = redisTemplate.opsForValue().get(RedisKeys.getRoomRedisId(roomId));
			// 게임 진행 상태 및 유저 참여 상태 확인
			if (!roomValidator.isRoomGaming(Long.parseLong(Objects.requireNonNull(roomUUID))) || // UUID가 필요함
				!roomValidator.isUserInGamingRoom(Long.parseLong(Objects.requireNonNull(roomUUID)), userId)) {
				response.sendError(HttpStatus.FORBIDDEN.value(), "음성 채팅에 접근할 수 없습니다.");
				return false;
			}
		}
		return true;
	}

	/**
	 * URL에서 팀 ID 추출 (/api/team/{teamId}/voice/...)
	 */
	private Long extractRoomId(HttpServletRequest request) {
		String uri = request.getRequestURI();
		log.info("uri: {}", uri);
		Pattern pattern = Pattern.compile("/team/(\\d+)/voice");
		Matcher matcher = pattern.matcher(uri);
		if (matcher.find()) {
			return Long.parseLong(matcher.group(1));
		}
		throw new IllegalArgumentException("URI에서 팀 ID를 찾을 수 없습니다.");
	}

	/**
	 * Security Context에서 인증된 사용자 ID 추출
	 */
	private Long extractUserId(HttpServletRequest request) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		log.info("auth : {}", auth);
		if (auth != null && auth.getPrincipal() instanceof Long) {
			log.info("유저 id: {}", auth.getPrincipal());
			return (Long)auth.getPrincipal();
		}
		throw new IllegalStateException("인증된 사용자를 찾을 수 없습니다.");
	}
}
