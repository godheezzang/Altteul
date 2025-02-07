import axios from 'axios';
import { UserGameRecordResponse, UserInfoResponse } from 'types/types';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getUserInfo = async (userId: string) => {
  const response = await axios.get<UserInfoResponse>(`${BASE_URL}/api/user/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getMyUserInfo = async (token: string) => {
  const response = await axios.get<UserInfoResponse>('/api/user/me', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserRecord = async (userId: string, lang: string, type: string) => {
  const response = await axios.get<UserGameRecordResponse>(`${BASE_URL}/api/game/history/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      lang,
      type,
    },
  });
  return response.data;
};
