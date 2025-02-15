import React, { useEffect, useState } from 'react';
import ChatListItem from '@components/Friend/chat/ChatListItem';
import { getChatRooms } from '@utils/Api/chatApi';
import { ChatRoom } from 'types/types';

interface ChatListContentProps {
  onChatSelect?: (friendId: number) => void;
  searchQuery?: string;
}

const ChatListContent = ({ onChatSelect, searchQuery = '' }: ChatListContentProps) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatRooms = async () => {
    setIsLoading(true);
    try {
      const response = await getChatRooms();
      console.log('채팅방 목록 응답:', response); // 개발 시 데이터 확인용

      if (response.status === 200) {
        setChatRooms(response.data);
      } else {
        throw new Error('서버 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
      setError(error instanceof Error ? error.message : '채팅방 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  // 검색어로 채팅방 필터링
  const filteredChats = chatRooms.filter(
    chat =>
      chat.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.recentMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center text-gray-03">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="chat-list space-y-2">
      {filteredChats.length > 0 ? (
        filteredChats.map(chat => (
          <ChatListItem
            key={chat.friendId}
            {...chat}
            profileImg={chat.profileImg} // API 응답의 profileImage를 컴포넌트의 profileImg로 매핑
            onSelect={onChatSelect}
          />
        ))
      ) : (
        <p className="text-center text-gray-03">검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default ChatListContent;
