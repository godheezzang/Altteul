import axios from 'axios';
import { UserInfoResponse } from 'types/types';

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
