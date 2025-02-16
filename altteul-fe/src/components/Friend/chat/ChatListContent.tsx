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
      const data = await getChatRooms();
      setChatRooms(data);
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
  const filteredChats = chatRooms.filter(chat => {
    const searchLower = searchQuery.toLowerCase();
    const latestMessage = chat.messages[chat.messages.length - 1]?.messageContent || '';

    return (
      chat.nickname.toLowerCase().includes(searchLower) ||
      latestMessage.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return <div className="text-center text-gray-03">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="chat-list space-y-2">
      {filteredChats.length > 0 ? (
        filteredChats.map(chat => {
          const latestMessage = chat.messages[chat.messages.length - 1];

          return (
            <ChatListItem
              key={chat.friendId}
              friendId={chat.friendId}
              nickname={chat.nickname}
              profileImg={chat.profileImg}
              isOnline={chat.isOnline}
              recentMessage={latestMessage?.messageContent || '새로운 대화를 시작해보세요'}
              isMessageRead={latestMessage?.checked ?? true}
              createdAt={latestMessage?.createdAt || chat.createdAt}
              onSelect={onChatSelect}
            />
          );
        })
      ) : (
        <p className="text-center text-gray-03">
          {searchQuery ? '검색 결과가 없습니다.' : '채팅방이 없습니다.'}
        </p>
      )}
    </div>
  );
};

export default ChatListContent;
