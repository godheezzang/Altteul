package com.c203.altteulbe.websocket;

import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.common.security.utils.JWTUtil;
import com.c203.altteulbe.friend.service.UserStatusService;
import com.c203.altteulbe.room.persistent.repository.SingleRoomRedisRepository;
import com.c203.altteulbe.room.service.SingleRoomService;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.room.web.dto.request.SingleRoomRequestDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
	private final UserStatusService userStatusService;
	private final SingleRoomRedisRepository singleRoomRedisRepository;
	private final SingleRoomService singleRoomService;
	private final RedisTemplate<String, String> redisTemplate;
	private final JWTUtil jwtUtil;

	private final String ONLINE = "online";
	private final String OFFLINE = "offline";

	@EventListener
	public void handleWebSocketConnectListener(SessionConnectEvent event) {
		log.info("연결중");
	}

	@EventListener
	public void handleWebSocketConnectListener(SessionConnectedEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		try {
			Long userId = getUserIdFromSession(accessor);
			userStatusService.setUserOnline(userId);
			//friendService.notifyFriendsOnlineStatus(userId, ONLINE);
			log.info("유저가 연결되었습니다 - userId: {}", userId);
		} catch (Exception e) {
			log.error("WebSocket 연결 처리 실패: {}", e.getMessage());
		}
	}

	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		try {
			Long userId = getUserIdFromSession(accessor);
			Long roomId = singleRoomRedisRepository.getUserRoomId(userId);

			// 웹소켓 연결이 끊긴 유저와 연결된 방이 있는 경우 퇴장 처리
			if (roomId != null) {
				String roomStatusKey = RedisKeys.SingleRoomStatus(roomId);
				String status = redisTemplate.opsForValue().get(roomStatusKey);

				if ("counting".equals(status)) {
					log.info("WebSocket Disconnect 발생 : userId : {}, roomId : {}", userId, roomId);
					SingleRoomRequestDto leftUser = SingleRoomRequestDto.toDto(userId);
					singleRoomService.leaveSingleRoom(leftUser);
				}
			}
			userStatusService.setUserOffline(userId);
			log.info("유저가 연결 해제 되었습니다 - userId: {}", userId);
		} catch (Exception e) {
			log.error("WebSocket 연결 해제 처리 실패: {}", e.getMessage());
		}
	}

	private Long getUserIdFromSession(StompHeaderAccessor accessor) {
		String token = accessor.getFirstNativeHeader("Authorization");
		if (token == null && !token.startsWith("Bearer ")) {
			throw new BusinessException("유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED);
		}
		token = token.substring(7); // "Bearer " 제거

		try {
			if (jwtUtil.isExpired(token)) {
				throw new BusinessException("만료된 토큰입니다.", HttpStatus.UNAUTHORIZED);
			}
			Long userId = jwtUtil.getId(token);
			if (userId == null) {
				throw new BusinessException("토큰에서 사용자 ID를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);
			}
			return userId;
		} catch (Exception e) {
			throw new BusinessException("토큰 처리 중 오류가 발생했습니다.", HttpStatus.UNAUTHORIZED);
		}
	}
}
