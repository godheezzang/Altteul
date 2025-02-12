import { api } from '@utils/Api/commonApi';
import { ChatRoomsResponse } from 'types/types';

export const getChatRooms = async () => {
  try {
    const { data } = await api.get<ChatRoomsResponse>('/chatroom');
    return data;
  } catch (error) {
    console.error('채팅방을 가져오는 데 실패했습니다.:', error);
    throw error;
  }
};
