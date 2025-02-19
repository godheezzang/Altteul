package com.c203.altteulbe.openvidu.service;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class VoiceChatService {
// 	private final OpenVidu openVidu;
// 	private final RedisTemplate<String, String> redisTemplate;
// 	private final SimpMessagingTemplate messagingTemplate;
// 	private final RoomValidator roomValidator;
//
// 	// 게임 시작 시 팀 음성 채팅 세션 설정
// 	public void createTeamVoiceSession(String matchId, Long roomUUID) {
// 		String sessionId = "team-" + roomUUID;
// 		try {
// 			SessionProperties properties = SessionProperties.fromJson(Map.of(
// 				"customSessionId", sessionId,
// 				"recordingMode", RecordingMode.MANUAL.toString(),
// 				"defaultOutputMode", Recording.OutputMode.COMPOSED.toString()
// 			)).build();
//
// 			openVidu.createSession(properties);
// 			redisTemplate.opsForValue().set(RedisKeys.getVoiceSessionKey(roomUUID), sessionId);
//
// 			log.info("Team {} voice session created for match {}", roomUUID, matchId);
// 		} catch (Exception e) {
// 			log.error("Failed to create voice session for team {}", roomUUID, e);
// 			throw new RuntimeException("음성 채팅 세션 생성 실패", e);
// 		}
// 	}
//
// 	// 유저 음성 채팅 연결 초기화 (게임 참여 시)
// 	public Connection initializeVoiceSession(Long roomId, String userId) throws
// 		OpenViduJavaClientException,
// 		OpenViduHttpException {
// 		String roomUUID = redisTemplate.opsForValue().get(RedisKeys.getRoomRedisId(roomId));
// 		if (!roomValidator.isRoomGaming(Long.parseLong(Objects.requireNonNull(roomUUID)))) {
// 			throw new RoomNotInGamingStateException();
// 		}
// 		// 세션 ID 가져오거나 새로 생성
// 		String sessionId = getOrCreateSessionId(Long.parseLong(Objects.requireNonNull(roomUUID)));
// 		Session session = openVidu.getActiveSession(sessionId);
//
// 		// 세선 예외 처리
// 		if (session == null) {
// 			throw new NotFoundSessionException();
// 		}
// 		// WebRTC 연결 속성 설정
// 		ConnectionProperties properties = new ConnectionProperties.Builder()
// 			.type(ConnectionType.WEBRTC)
// 			.data(userId)
// 			.build();
//
// 		// 연결 생성 및 참가자 상태 업데이트
// 		Connection connection = session.createConnection(properties);
// 		updateParticipantStatus(Long.parseLong(Objects.requireNonNull(roomUUID)), userId, true);
//
// 		// 팀원들에게 새 참가자 입장 알림
// 		VoiceEventResponseDto response = VoiceEventResponseDto.builder()
// 			.userId(userId)
// 			.roomId(roomId)
// 			.type(VoiceEventType.JOIN)
// 			.status(true)
// 			.build();
// 		notifyTeam(roomId, response);
// 		return connection;
// 	}
//
// 	// Redis에서 새션 ID 조회 또는 생성
// 	private String getOrCreateSessionId(Long roomUUID) {
// 		String voiceSessionKey = RedisKeys.getVoiceSessionKey(roomUUID);
// 		String sessionId = redisTemplate.opsForValue().get(voiceSessionKey);
//
// 		if (sessionId == null) {
// 			sessionId = "team-" + roomUUID;
// 			redisTemplate.opsForValue().set(voiceSessionKey, sessionId);
// 		}
//
// 		return sessionId;
// 	}
//
// 	// 마이크 상태 업데이트 및 알림
// 	public void updateMicStatus(Long roomId, String userId, boolean isMuted) {
// 		String roomUUID = redisTemplate.opsForValue().get(RedisKeys.getRoomRedisId(roomId));
// 		updateParticipantStatus(Long.parseLong(Objects.requireNonNull(roomUUID)), userId, !isMuted);
// 		VoiceEventResponseDto response = VoiceEventResponseDto.builder()
// 			.userId(userId)
// 			.roomId(roomId)
// 			.type(VoiceEventType.MIC_STATUS)
// 			.status(!isMuted)
// 			.build();
// 		notifyTeam(roomId, response);
// 	}
//
// 	// 게임 종료 시 팀 음성 채팅 세션 종료
// 	public void terminateTeamVoiceSession(Long roomUUID) {
// 		try {
// 			Session session = openVidu.getActiveSession("team-" + roomUUID);
// 			if (session != null) {
// 				session.close();
// 			}
// 			// Redis 데이터 삭제
// 			redisTemplate.delete(RedisKeys.getVoiceSessionKey(roomUUID));
// 			redisTemplate.delete(RedisKeys.getVoiceParticipantsKey(roomUUID));
//
// 		} catch (Exception e) {
// 			log.error("Failed to terminate voice session for team {}", roomUUID, e);
// 		}
// 	}
//
// 	// 게임 나가기 시 개별 유저 연결 종료
// 	public void terminateUserVoiceConnection(Long roomUUID, String userId) {
// 		try {
// 			Session session = openVidu.getActiveSession("team-" + roomUUID);
// 			if (session != null) {
// 				session.getConnections().stream()
// 					.filter(conn -> conn.getClientData().equals(userId))
// 					.forEach(conn -> {
// 						try {
// 							session.forceDisconnect(conn);
// 						} catch (OpenViduJavaClientException | OpenViduHttpException e) {
// 							throw new RuntimeException(e);
// 						}
// 					});
// 			}
// 			removeParticipant(roomUUID, userId);
//
// 			log.info("User {} voice connection terminated in team {}", userId, roomUUID);
// 		} catch (Exception e) {
// 			log.error("Failed to terminate voice connection for user {} in team {}", userId, roomUUID, e);
// 		}
// 	}
//
// 	// Redis에 참가자 상태 업데이트
// 	private void updateParticipantStatus(Long roomUUID, String userId, boolean micEnabled) {
// 		String key = RedisKeys.getVoiceParticipantsKey(roomUUID);
// 		HashOperations<String, String, String> hashOps = redisTemplate.opsForHash();
//
// 		String status = micEnabled ? "ENABLED" : "DISABLED";
// 		hashOps.put(key, userId, status);
// 		Map<String, String> entries = hashOps.entries(key);
// 		log.info(entries.toString());
// 	}
//
// 	// Redis에서 참가자 정보 삭제
// 	private void removeParticipant(Long roomUUID, String userId) {
// 		String key = RedisKeys.getVoiceParticipantsKey(roomUUID);
// 		redisTemplate.opsForHash().delete(key, userId);
// 	}
//
// 	// WebSocket을 통해 팀원들에게 상태 변경 요청
// 	private void notifyTeam(Long roomId, VoiceEventResponseDto event) {
// 		messagingTemplate.convertAndSend("/sub/team/" + roomId + "/voice/status",
// 			WebSocketResponse.withData(event.getType().toString(), event));
// 	}
// }
