// utils/api/friendApi.ts

import { api } from '@utils/Api/commonApi';
import { FriendsResponse } from 'types/types';

interface GetFriendsParams {
  page?: number;
  size?: number;
}

export const getFriends = async ({ page = 0, size = 10 }: GetFriendsParams = {}) => {
  try {
    const { data } = await api.get<FriendsResponse>('/friends', {
      params: { page, size },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch friends:', error);
    throw error;
  }
};
