import { api } from '@utils/Api/commonApi';
import { UserGameRecordResponse, UserInfoResponse, UserSearchResponse } from 'types/types';

export const getUserInfo = async (userId: string): Promise<UserInfoResponse> => {
  const response = await api.get(`user/${userId}`);
  return response.data;
};

export const getUserRecord = async (userId: string): Promise<UserGameRecordResponse> => {
  const response = await api.get(`game/history/${userId}`);
  return response.data;
};

// 유저 검색
export const searchUser = async (nickname: string) => {
  try {
    const { data } = await api.get<UserSearchResponse>('/user/search', {
      params: { nickname },
    });
    return data;
  } catch (error) {
    console.error('Failed to search user:', error);
    throw error;
  }
};
