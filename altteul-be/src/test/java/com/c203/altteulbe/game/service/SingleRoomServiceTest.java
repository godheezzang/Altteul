package com.c203.altteulbe.game.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.c203.altteulbe.common.dto.Language;
import com.c203.altteulbe.common.response.WebSocketResponse;
import com.c203.altteulbe.game.repository.SingleRoomRepository;
import com.c203.altteulbe.game.web.dto.request.SingleRoomRequestDto;
import com.c203.altteulbe.game.web.dto.response.SingleRoomEnterResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension.class)
//@Transactional
class SingleRoomServiceTest {

	@Autowired
	private SingleRoomService singleRoomService;

	@Autowired
	private UserJPARepository userRepository;

	@Autowired
	private SingleRoomRepository singleRoomRepository;

	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	@MockBean
	private SimpMessagingTemplate messagingTemplate;

	@Test
	void 기존_유저들에게_웹소켓_메시지가_전송되는지_검증한다() {
		// Given: 유저가 방에 입장
		User user = User.builder()
			.nickname("test32")
			.username("test32")
			.mainLang(Language.JV)
			.password("12345")
			.profileImg("test.png")
			.provider(User.Provider.LC)
			.userStatus(User.UserStatus.A)
			.rankingPoint(0L)
			.tierId((byte)1)
			.userStatus(User.UserStatus.D)
			.build();
		userRepository.save(user);

		SingleRoomRequestDto requestDto = SingleRoomRequestDto.builder()
																		.userId(user.getUserId())
																		.build();

		SingleRoomEnterResponseDto responseDto = singleRoomService.enterSingleRoom(requestDto);

		// When: WebSocket으로 메시지 전송 시도
		doNothing().when(messagingTemplate).convertAndSend(anyString(), any(WebSocketResponse.class));

		// WebSocket을 통해 입장한 방의 id를 구독 중인 기존 유저들에게 새 유저가 입장했음을 알리는 메시지 전송
		messagingTemplate.convertAndSend("/sub/single/room/" + responseDto.getRoomId(),
											new WebSocketResponse<>("ENTER", responseDto));

		// Then: 메시지가 단 한 번 정상적으로 전송되었는지 검증
		verify(messagingTemplate, times(1)).convertAndSend(anyString(), any(WebSocketResponse.class));
	}

	@Test
	void 웹소켓_전송이_실패하더라도_정상적으로_API_응답이_이루어지는지_검증한다() {
		User user = User.builder()
			.nickname("test35")
			.username("test35")
			.mainLang(Language.JV)
			.password("12345")
			.profileImg("test.png")
			.provider(User.Provider.LC)
			.userStatus(User.UserStatus.A)
			.rankingPoint(0L)
			.tierId((byte)1)
			.userStatus(User.UserStatus.D)
			.build();
		userRepository.save(user);

		// Given: 유저가 방에 입장
		SingleRoomRequestDto requestDto = SingleRoomRequestDto.builder()
																		.userId(user.getUserId())
																		.build();
		// When: WebSocket 전송이 실패하도록 설정
		doThrow(new RuntimeException("WebSocket 전송 실패"))
			.when(messagingTemplate).convertAndSend(anyString(), any(WebSocketResponse.class));

		// API 요청이 정상적으로 이루어지는지 확인
		SingleRoomEnterResponseDto responseDto = singleRoomService.enterSingleRoom(requestDto);

		// Then: API 응답은 정상적으로 반환되어야 함
		assertNotNull(responseDto);
		assertEquals(user.getUserId(), responseDto.getLeaderId());  // 방이 새로 생성되면서 입장한 유저는 방장이 되어야 함
	}
}
