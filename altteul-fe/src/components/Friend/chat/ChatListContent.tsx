// components/friend/ChatListContent.tsx
import React from 'react';
import ChatListItem from '@components/friend/chat/ChatListItem';
import { mockChatRooms } from 'mocks/friendData';

type ChatListContentProps = {
  onChatSelect?: (friendId: number) => void;
  searchQuery?: string;
};

const ChatListContent = ({ onChatSelect, searchQuery = '' }: ChatListContentProps) => {
  // 검색어로 채팅방 필터링
  const filteredChats = mockChatRooms.filter(
    chat =>
      chat.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.recentMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-list space-y-2">
      {filteredChats.map(chat => (
        <ChatListItem key={chat.friendId} {...chat} onSelect={onChatSelect} />
      ))}
    </div>
  );
};

export default ChatListContent;
