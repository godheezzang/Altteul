package com.c203.altteulbe.websocket;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import com.c203.altteulbe.friend.service.UserStatusService;
import com.c203.altteulbe.room.persistent.repository.single.SingleRoomRedisRepository;
import com.c203.altteulbe.room.service.single.SingleRoomService;
import com.c203.altteulbe.common.utils.RedisKeys;

@ExtendWith(MockitoExtension.class)
class WebSocketEventListenerTest {
	@Mock
	private UserStatusService userStatusService;

	@Mock
	private SingleRoomRedisRepository singleRoomRedisRepository;

	@Mock
	private SingleRoomService singleRoomService;

	@Mock
	private RedisTemplate<String, String> redisTemplate;

	@Mock
	private ValueOperations<String, String> valueOperations;

	@InjectMocks
	private WebSocketEventListener webSocketEventListener;

	@Test
	void 웹소켓_연결이_끊기고_방_상태가_counting이면_퇴장_처리_실행() throws Exception {
		// Given
		Long userId = 100L;
		Long roomId = 1L;
		String roomStatusKey = RedisKeys.SingleRoomStatus(roomId);

		// Mock Redis 반환값 설정
		when(singleRoomRedisRepository.getRoomIdByUser(userId)).thenReturn(roomId);
		when(redisTemplate.opsForValue()).thenReturn(valueOperations);
		when(valueOperations.get(roomStatusKey)).thenReturn("counting");

		// Mock WebSocket Disconnect Event 생성
		Message<byte[]> message = MessageBuilder.withPayload(new byte[0]).build();
		String sessionId = "test-session-id";         // 테스트용 세션 ID
		CloseStatus closeStatus = CloseStatus.NORMAL; // 정상 종료 상태
		SessionDisconnectEvent event = new SessionDisconnectEvent(this, message, sessionId, closeStatus);

		// WebSocketEventListener를 Spy로 변경
		WebSocketEventListener spyListener = Mockito.spy(webSocketEventListener);

		// WebSocketEventListener의 getUserIdFromSession을 protected로 변경해야 테스트 실행 가능
		//doReturn(userId).when(spyListener).getUserIdFromSession(any());

		// When
		spyListener.handleWebSocketDisconnectListener(event);

		// Then
		verify(singleRoomService).leaveSingleRoom(argThat(req -> req.getUserId().equals(userId)));
		verify(userStatusService).setUserOffline(userId);
	}
}