package com.c203.altteulbe.openvidu.service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.c203.altteulbe.common.dto.VoiceEventType;
import com.c203.altteulbe.common.utils.RedisKeys;
import com.c203.altteulbe.openvidu.web.dto.response.ParticipantResponseDto;
import com.c203.altteulbe.openvidu.web.dto.response.VoiceChatJoinResponseDto;
import com.c203.altteulbe.openvidu.web.dto.response.VoiceEventResponseDto;
import com.c203.altteulbe.websocket.dto.response.WebSocketResponse;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.ConnectionType;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Recording;
import io.openvidu.java.client.RecordingMode;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoiceChatService {
	private final OpenVidu openVidu;
	private final RedisTemplate<String, String> redisTemplate;
	private final SimpMessagingTemplate messagingTemplate;

	public Connection initializeVoiceSession(Long teamId, String userId) throws
		OpenViduJavaClientException,
		OpenViduHttpException {
		String sessionId = getOrCreateSessionId(teamId);
		Session session = openVidu.getActiveSession(sessionId);

		if (session == null) {
			SessionProperties properties = SessionProperties.fromJson(Map.of(
				"customSessionId", sessionId,
				"recordingMode", RecordingMode.MANUAL,
				"defaultOutputMode", Recording.OutputMode.COMPOSED
			)).build();
			session = openVidu.createSession(properties);
		}
		ConnectionProperties properties = new ConnectionProperties.Builder()
			.type(ConnectionType.WEBRTC)
			.data(userId)
			.build();

		Connection connection = session.createConnection(properties);
		updateParticipantStatus(teamId, userId, true);
		VoiceEventResponseDto response = VoiceEventResponseDto.builder()
			.userId(userId)
			.teamId(teamId)
			.type(VoiceEventType.JOIN)
			.status(true)
			.build();
		notifyTeam(teamId, response);
		return connection;
	}

	private String getOrCreateSessionId(Long teamId) {
		String voiceSessionKey = RedisKeys.getVoiceSessionKey(teamId);
		String sessionId = redisTemplate.opsForValue().get(voiceSessionKey);

		if (sessionId == null) {
			sessionId = "team-" + teamId;
			redisTemplate.opsForValue().set(voiceSessionKey, sessionId);
		}

		return sessionId;
	}

	public void updateMicStatus(Long teamId, String userId, boolean isMuted) {
		updateParticipantStatus(teamId, userId, !isMuted);
		VoiceEventResponseDto response = VoiceEventResponseDto.builder()
			.userId(userId)
			.teamId(teamId)
			.type(VoiceEventType.MIC_STATUS)
			.status(!isMuted)
			.build();
		notifyTeam(teamId, response);
	}

	public void leaveVoiceChat(Long teamId, String userId) {
		removeParticipant(teamId, userId);
		VoiceEventResponseDto response = VoiceEventResponseDto.builder()
			.userId(userId)
			.teamId(teamId)
			.type(VoiceEventType.LEAVE)
			.status(false)
			.build();
		notifyTeam(teamId, response);
	}

	public void updateParticipantStatus(Long teamId, String userId, boolean micEnabled) {
		String key = RedisKeys.getVoiceParticipantsKey(teamId);
		HashOperations<String, String, ParticipantResponseDto> hashOps = redisTemplate.opsForHash();

		ParticipantResponseDto participant = ParticipantResponseDto.builder()
			.userId(userId)
			.connected(true)
			.micEnabled(micEnabled)
			.build();
		hashOps.put(key, userId, participant);
	}

	private void removeParticipant(Long teamId, String userId) {
		String key = RedisKeys.getVoiceParticipantsKey(teamId);
		redisTemplate.opsForHash().delete(key, userId);
	}

	private void notifyTeam(Long teamId, VoiceEventResponseDto event) {
		messagingTemplate.convertAndSend("/sub/team/" + teamId + "/voice",
			WebSocketResponse.withData(event.getType().toString(), event));
	}

	public VoiceChatJoinResponseDto getTeamVoiceState(Long teamId) {
		String key = RedisKeys.getVoiceParticipantsKey(teamId);
		HashOperations<String, String, ParticipantResponseDto> hashOps = redisTemplate.opsForHash();

		String sessionId = getOrCreateSessionId(teamId);
		Set<ParticipantResponseDto> participants = new HashSet<>(hashOps.values(key));

		return VoiceChatJoinResponseDto.builder()
			.token(null)
			.sessionId(sessionId)
			.participants(participants)
			.build();
	}
}
