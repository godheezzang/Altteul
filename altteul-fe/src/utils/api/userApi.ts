import axios from "axios";
import { gameRecordData } from "mocks/gameRecordData";
import { UserGameRecordResponse, UserInfoResponse } from "types/types";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getUserInfo = async (userId: string, token: string = "") => {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await axios.get<UserInfoResponse>(`${BASE_URL}/api/user/${userId}`, { headers });
	return response.data;
};

export const getUserRecord = async (userId: string): Promise<UserGameRecordResponse> => {
	// API 개발되면 주석 해제
	const response = await axios.get<UserGameRecordResponse>(`${BASE_URL}/api/game/history/${userId}`, {
		headers: {
			"Content-Type": "application/json",
		},
	});

	return response.data;
};
