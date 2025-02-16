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

interface DeleteFriendParams {
  friendId: number;
}

interface AcceptFriendRequestParams {
  requestId: number; // 친구 요청 ID
}

interface RejectFriendRequestParams {
  requestId: number; // 친구 요청 ID
}

// 친구 목록 조회
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

// 친구 요청 수락
export const acceptFriendRequest = async ({ requestId }: AcceptFriendRequestParams) => {
  try {
    const { data } = await api.post(`/friend/request/accept/${requestId}`);
    return data;
  } catch (error) {
    console.error('Failed to accept friend request:', error);
    throw error;
  }
};

// 친구 요청 거절
export const rejectFriendRequest = async ({ requestId }: RejectFriendRequestParams) => {
  try {
    const { data } = await api.post(`/friend/request/reject/${requestId}`);
    return data;
  } catch (error) {
    console.error('Failed to reject friend request:', error);
    throw error;
  }
};
