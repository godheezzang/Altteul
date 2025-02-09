import axios from 'axios';
import { gameRecordData } from 'mocks/gameRecordData';
import { UserGameRecordResponse, UserInfoResponse } from 'types/types';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getUserInfo = async (userId: string, token: string = '') => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.get<UserInfoResponse>(`${BASE_URL}/api/user/${userId}`, { headers });
  return response.data;
};

export const getUserRecord = async (userId: string, lang: string, type: string): Promise<UserGameRecordResponse> => {
  // API 개발되면 주석 해제
  // const response = await axios.get<UserGameRecordResponse>(`${BASE_URL}/api/game/history/${userId}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   params: {
  //     lang,
  //     type,
  //   },
  // });
  // return response.data;

  // 목 데이터 사용
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(gameRecordData);
    }, 500); // 실제 API 호출을 시뮬레이션하기 위해 조금 기다렸다가 띄움
  });
};
