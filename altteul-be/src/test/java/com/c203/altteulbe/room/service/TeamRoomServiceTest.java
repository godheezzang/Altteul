package com.c203.altteulbe.room.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.friend.persistent.entity.FriendId;
import com.c203.altteulbe.friend.persistent.repository.FriendshipRepository;
import com.c203.altteulbe.friend.service.UserStatusService;
import com.c203.altteulbe.room.persistent.repository.team.TeamRoomRedisRepository;
import com.c203.altteulbe.room.service.RoomValidator;
import com.c203.altteulbe.room.service.RoomWebSocketService;
import com.c203.altteulbe.room.service.TeamRoomService;
import com.c203.altteulbe.room.service.exception.AlreadyExpiredInviteException;
import com.c203.altteulbe.room.service.exception.OnlyOnlineFriendCanInviteException;
import com.c203.altteulbe.room.web.dto.request.InviteTeamAnswerRequestDto;
import com.c203.altteulbe.room.web.dto.request.InviteTeamRequestDto;
import com.c203.altteulbe.room.web.dto.response.RoomEnterResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;

@ExtendWith(MockitoExtension.class)
class TeamRoomServiceTest {

	@InjectMocks
	private TeamRoomService teamRoomService;

	@Mock
	private UserJPARepository userJPARepository;

	@Mock
	private FriendshipRepository friendshipRepository;

	@Mock
	private UserStatusService userStatusService;

	@Mock
	private RedisTemplate<String, String> redisTemplate;

	@Mock
	private RoomWebSocketService roomWebSocketService;

	@Mock
	private TeamRoomRedisRepository teamRoomRedisRepository;

	@Mock
	private RoomValidator validator;

	@Mock
	private ValueOperations<String, String> valueOps;

	@Mock
	private ListOperations<String, String> listOps;

	@Test
	void inviteFriendToTeam_Success() {
		// Given
		InviteTeamRequestDto requestDto = new InviteTeamRequestDto();
		requestDto.setRoomId(1L);
		requestDto.setInviterId(1L);
		requestDto.setInviteeId(2L);

		// Mocking
		when(redisTemplate.opsForValue()).thenReturn(valueOps);
		when(redisTemplate.opsForList()).thenReturn(listOps);
		when(userJPARepository.findByUserId(1L)).thenReturn(Optional.of(new User()));
		when(userJPARepository.findById(2L)).thenReturn(Optional.of(new User()));
		when(friendshipRepository.existsById(any(FriendId.class))).thenReturn(true);
		when(userStatusService.isUserOnline(2L)).thenReturn(true);
		when(valueOps.get(RedisKeys.userTeamRoom(1L))).thenReturn("1");
		when(redisTemplate.hasKey(RedisKeys.userTeamRoom(2L))).thenReturn(false);
		when(validator.isRoomWaiting(1L, BattleType.T)).thenReturn(true);
		when(listOps.size(RedisKeys.TeamRoomUsers(1L))).thenReturn(1L);

		String inviteKey = RedisKeys.inviteInfo("1", "2");
		when(redisTemplate.hasKey(inviteKey)).thenReturn(false);

		// When
		teamRoomService.inviteFriendToTeam(requestDto);

		// Then
		verify(valueOps).set(
			inviteKey,
			"pending",
			10,
			TimeUnit.MINUTES
		);

		verify(roomWebSocketService).sendWebSocketMessage(
			"/sub/invite/1",
			"INVITE_REQUEST_SUCCESS",
			"초대를 완료했습니다."
		);

		verify(roomWebSocketService).sendWebSocketMessage(
			eq("/sub/invite/2"),
			eq("INVITE_REQUEST_RECEIVED"),
			any(Map.class)
		);
	}

	@Test
	void handleInviteReaction_AcceptSuccess() {
		// Given
		InviteTeamAnswerRequestDto requestDto = new InviteTeamAnswerRequestDto();
		requestDto.setRoomId(1L);
		requestDto.setInviterId(1L);
		requestDto.setInviteeId(2L);
		requestDto.setAccepted(true);

		User invitee = new User();
		invitee.setUserId(2L);

		RoomEnterResponseDto responseDto = new RoomEnterResponseDto();

		// Mocking
		String inviteKey = RedisKeys.inviteInfo("1", "2");
		when(redisTemplate.hasKey(inviteKey)).thenReturn(true);
		when(validator.isRoomWaiting(1L, BattleType.T)).thenReturn(true);
		when(redisTemplate.opsForList()).thenReturn(listOps);
		when(listOps.size(RedisKeys.TeamRoomUsers(1L))).thenReturn(1L);
		when(userJPARepository.findByUserId(2L)).thenReturn(Optional.of(invitee));
		when(teamRoomRedisRepository.insertUserToExistingRoom(1L, invitee)).thenReturn(responseDto);

		// When
		teamRoomService.handleInviteReaction(requestDto);

		// Then
		verify(redisTemplate).delete(inviteKey);

		verify(roomWebSocketService).sendWebSocketMessage(
			"/sub/invite/1",
			"INVITE_ACCEPTED",
			"초대를 수락했습니다."
		);

		verify(roomWebSocketService).sendWebSocketMessage(
			"/sub/invite/2",
			"INVITE_ACCEPTED",
			"초대 수락 요청이 정상 처리되었습니다."
		);

		verify(roomWebSocketService).sendWebSocketMessage(
			"1",
			"ENTER",
			responseDto,
			BattleType.T
		);
	}

	@Test
	void handleInviteReaction_RejectSuccess() {
		// Given
		InviteTeamAnswerRequestDto requestDto = new InviteTeamAnswerRequestDto();
		requestDto.setRoomId(1L);
		requestDto.setInviterId(1L);
		requestDto.setInviteeId(2L);
		requestDto.setAccepted(false);

		String inviteKey = RedisKeys.inviteInfo("1", "2");
		when(redisTemplate.hasKey(inviteKey)).thenReturn(true);

		// When
		teamRoomService.handleInviteReaction(requestDto);

		// Then
		verify(redisTemplate).delete(inviteKey);

		verify(roomWebSocketService).sendWebSocketMessage(
			"/sub/invite/1",
			"INVITE_REJECTED",
			"초대를 거절했습니다."
		);

		verify(roomWebSocketService).sendWebSocketMessage(
			"/sub/invite/2",
			"INVITE_REJECTED",
			"초대 거절 요청이 정상 처리되었습니다."
		);
	}

	@Test
	void inviteFriendToTeam_FailWhenFriendOffline() {
		// Given
		InviteTeamRequestDto requestDto = new InviteTeamRequestDto();
		requestDto.setRoomId(1L);
		requestDto.setInviterId(1L);
		requestDto.setInviteeId(2L);

		when(userJPARepository.findByUserId(1L)).thenReturn(Optional.of(new User()));
		when(userJPARepository.findById(2L)).thenReturn(Optional.of(new User()));
		when(friendshipRepository.existsById(any(FriendId.class))).thenReturn(true);
		when(userStatusService.isUserOnline(2L)).thenReturn(false);

		// When & Then
		assertThrows(OnlyOnlineFriendCanInviteException.class, () -> {
			teamRoomService.inviteFriendToTeam(requestDto);
		});
	}

	@Test
	void handleInviteReaction_FailWhenInviteExpired() {
		// Given
		InviteTeamAnswerRequestDto requestDto = new InviteTeamAnswerRequestDto();
		requestDto.setRoomId(1L);
		requestDto.setInviterId(1L);
		requestDto.setInviteeId(2L);
		requestDto.setAccepted(true);

		String inviteKey = RedisKeys.inviteInfo("1", "2");
		when(redisTemplate.hasKey(inviteKey)).thenReturn(false);

		// When & Then
		assertThrows(AlreadyExpiredInviteException.class, () -> {
			teamRoomService.handleInviteReaction(requestDto);
		});
	}
}