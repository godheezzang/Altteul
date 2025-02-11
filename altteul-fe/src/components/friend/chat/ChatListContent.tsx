// components/friend/ChatListContent.tsx
// 챗리스트 아이템을 돌면서 목록에 표시

import React from 'react';

import ChatListItem from '@components/friend/chat/ChatListItem';
import { mockChatRooms } from 'mocks/friendData';

type ChatListContentProps = {
  onChatSelect?: (friendId: number) => void;
  searchQuery?: string;
};

const ChatListContent = ({ onChatSelect, searchQuery = '' }: ChatListContentProps) => {
  // 검색어로 채팅방 필터링
  const filterdChats = mockChatRooms.filter(chat =>
    chat.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="chat-list space-y-4">
      {filterdChats.map(chat => (
        <ChatListItem key={chat.friendId} {...chat} onSelect={onChatSelect} />
      ))}
    </div>
  );
};

export default ChatListContent;
