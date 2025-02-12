// 채팅 목록 조회
import { api } from '@utils/Api/commonApi';
import { ChatRoomDetailResponse, ChatRoomsResponse } from 'types/types';

export const getChatRooms = async () => {
  try {
    const { data } = await api.get<ChatRoomsResponse>('/chatroom');
    return data;
  } catch (error) {
    console.error('채팅방을 가져오는 데 실패했습니다.:', error);
    throw error;
  }
};

// 단일 채팅 조회
export const getChatRoomDetail = async (friendId: number) => {
  try {
    const { data } = await api.get<ChatRoomDetailResponse>(`/chatroom/friend/${friendId}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch chat room detail:', error);
    throw error;
  }
};
