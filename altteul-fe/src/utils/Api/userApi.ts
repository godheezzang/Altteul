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
export const searchUsers = async (nickname: string) => {
  console.log('🔍 검색 시작:', nickname); // 검색 시작 시점

  try {
    // console.log(`${sessionStorage.getItem('token')}`);
    const { data } = await api.get<UserSearchResponse>('/user/search', {
      params: { nickname },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
    console.log('✅ 검색 결과:', data); // 성공적인 응답
    return data;
  } catch (error) {
    console.error('❌ 검색 에러:', error); // 에러 발생
    throw error;
  }
};
