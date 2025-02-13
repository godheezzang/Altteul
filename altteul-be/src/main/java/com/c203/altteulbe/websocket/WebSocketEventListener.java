package com.c203.altteulbe.websocket;

import java.util.Map;

import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.friend.service.UserStatusService;
import com.c203.altteulbe.openvidu.service.VoiceChatService;
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRedisRepository;
import com.c203.altteulbe.room.service.SingleRoomService;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;
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
	private final VoiceChatService voiceChatService;

	@EventListener
	public void handleWebSocketConnectListener(SessionConnectEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
		if (sessionAttributes != null && sessionAttributes.containsKey("userId")) {
			try {
				Long userId = (Long)sessionAttributes.get("userId");
				userStatusService.setUserOnline(userId);
				log.info("유저가 연결 되었습니다 - userId: {}", userId);
			} catch (Exception e) {
				log.error("WebSocket 연결 처리 실패: {}", e.getMessage());
			}
		} else {
			log.info("WebSocket 연결 처리 실패: session attributes에서 userId를 찾을 수 없습니다.");
			throw new NotFoundUserException();
		}
	}

	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		Map<String, Object> sessionAttributes = accessor.getSessionAttributes();

		log.info(accessor.toString());

		if (sessionAttributes != null && sessionAttributes.containsKey("userId")) {
			try {
				Long userId = (Long)sessionAttributes.get("userId");
				Long roomId = singleRoomRedisRepository.getRoomIdByUser(userId);
				Long teamId = (Long)sessionAttributes.get("teamId");

				if (userId != null && teamId != null) {
					log.info("{} 팀 유저 {} 연결 해제 되었습니다.", teamId, userId);
					voiceChatService.terminateUserVoiceConnection(teamId, userId.toString());
				}

				// 웹소켓 연결이 끊긴 유저와 연결된 방이 있는 경우 퇴장 처리
				if (userId != null && roomId != null) {
					String roomStatusKey = RedisKeys.SingleRoomStatus(roomId);
					String status = redisTemplate.opsForValue().get(roomStatusKey);

					if ("counting".equals(status)) {
						log.info("WebSocket Disconnect 발생 : userId : {}, roomId : {}", userId, roomId);
						singleRoomService.leaveSingleRoom(roomId, userId);
					}
				}
				userStatusService.setUserOffline(userId);
				log.info("유저가 연결 해제 되었습니다 - userId: {}", userId);
			} catch (Exception e) {
				log.error("WebSocket 연결 해제 처리 실패: {}", e.getMessage());
			}
		} else {
			log.info("WebSocket 연결 해제 처리 실패: session attributes에서 userId를 찾을 수 없습니다.");
			throw new NotFoundUserException();
		}
	}
}
