import { api } from '@utils/Api/commonApi';
import { FriendRequestsResponse, FriendsResponse } from 'types/types';

interface GetFriendsParams {
  page?: number;
  size?: number;
}

interface GetFriendRequestsParams {
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

// 친구신청 목록조회
export const getFriendRequests = async ({ page = 0, size = 10 }: GetFriendRequestsParams = {}) => {
  try {
    const { data } = await api.get<FriendRequestsResponse>('/friend/request', {
      params: { page, size },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch friend requests:', error);
    throw error;
  }
};
