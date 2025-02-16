// chatApi.ts
import { api } from '@utils/Api/commonApi';
import useAuthStore from '@stores/authStore';
import { ChatRoom } from 'types/types';

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<ChatRoom[]> => {
  try {
    const token = useAuthStore.getState().token;
    const { data } = await api.get<ChatRoom[]>('/chatroom/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error('채팅방 목록 조회 에러:', error);
    throw error;
  }
};

// 특정 친구와의 채팅방 조회
export const getChatRoom = async (friendId: number): Promise<ChatRoom> => {
  try {
    const token = useAuthStore.getState().token;
    const { data } = await api.get<ChatRoom>(`/chatroom/friend/${friendId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error('채팅방 조회 에러:', error);
    throw error;
  }
};
