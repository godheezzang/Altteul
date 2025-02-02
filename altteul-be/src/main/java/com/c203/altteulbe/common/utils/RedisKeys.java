package com.c203.altteulbe.common.utils;

public class RedisKeys {

	// 개인전 대기 중인 방 목록
	public static final String SINGLE_WAITING_ROOMS = "room:single:waiting_rooms";

	// 개인전 방 상태
	public static String SingleRoomStatus(Long roomId) {
		return "room:single:" + roomId + ":status";
	}

	// 개인전 방에 속한 유저 목록
	public static String SingleRoomUsers(Long roomId) {
		return "room:single:" + roomId + ":users";
	}

	// 특정 유저가 속한 개인전 방 정보
	public static String userSingleRoom(Long userId) {
		return "user:" + userId + ":single_room";
	}

	// 개인전 방의 방장


}
