package com.c203.altteulbe.openvidu.web.controller;

// @RestController
// @RequiredArgsConstructor
// @RequestMapping("/api/team/{roomId}/voice")
// @Slf4j
// public class VoiceChatController {
// 	 private final VoiceChatService voiceChatService;
//
// 	// 음성 채팅 참여
// 	@PostMapping("/join")
// 	public ApiResponseEntity<?> joinVoiceChat(
// 		@PathVariable(value = "roomId") Long roomId,
// 		@AuthenticationPrincipal Long userId) {
// 		try {
// 			Connection connection = voiceChatService.initializeVoiceSession(roomId, userId.toString());
// 			return ApiResponse.success(Map.of("token", connection.getToken()), HttpStatus.OK);
// 		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
// 			log.error("보이스 연결 실패", e);
// 			return ApiResponse.error("보이스 연결 실패", HttpStatus.INTERNAL_SERVER_ERROR);
// 		}
// 	}
//
// 	// 자신의 마이크 상태 업데이트 (음소거/음소거 해제)
// 	@PostMapping("/mic-status")
// 	public ApiResponseEntity<Void> updateMicStatus(
// 		@PathVariable(value = "roomId") Long roomId,
// 		@AuthenticationPrincipal Long userId,
// 		@RequestBody MicStatusUpdateRequestDto requestDto) {
// 		voiceChatService.updateMicStatus(roomId, userId.toString(), requestDto.getIsMuted());
// 		return ApiResponse.success();
// 	}
// }
