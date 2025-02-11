// 채팅창 모달

import React, { useState, useEffect } from 'react';
import FriendModal from '@components/friend/FriendModal';

import ChatHeader from '@components/friend/chat/ChatHeader';
import ChatMessage from '@components/friend/chat/ChatMessage';
import ChatInput from '@components/friend/chat/ChatInput';

import { mockChatRoomDetail } from 'mocks/friendData';

type FriendChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  friendId?: number;
};

const FriendChatModal = ({ isOpen, onClose, friendId = 1 }: FriendChatModalProps) => {
  const [message, setMessage] = useState('');
  const [currentChat, setCurrentChat] = useState(mockChatRoomDetail);
  const [chatHistory, setChatHistory] = useState(mockChatRoomDetail.messages);

  useEffect(() => {
    // 실제로는 여기서 API 호출을 하게 될 것입니다
    // 지금은 목데이터를 사용하므로 mockChatWithFriend를 그대로 사용
    setCurrentChat(mockChatRoomDetail);
    setChatHistory(mockChatRoomDetail.messages);
  }, [friendId]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        chatMessageId: Date.now(),
        senderId: 0,
        senderNickname: '나',
        messageContent: message,
        checked: false,
        createdAt: new Date().toISOString(),
      };
      setChatHistory(prevHistory => [...prevHistory, newMessage]);
      setMessage('');
    }
  };

  return (
    <FriendModal isOpen={isOpen} onClose={onClose} showSearch={false}>
      <div className="flex flex-col h-full">
        {/* 채팅방 헤더 */}
        <ChatHeader
          profileImg={currentChat.profileImg}
          nickname={currentChat.nickname}
          isOnline={currentChat.isOnline}
        />

        {/* 채팅 메시지 영역 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-white scrollbar-track-gray-03 hover:scrollbar-thumb-primary-orange/80">
          <div className="p-4 space-y-4">
            {chatHistory.map(msg => (
              <ChatMessage
                key={msg.chatMessageId}
                chatMessageId={msg.chatMessageId}
                senderId={msg.senderId}
                messageContent={msg.messageContent}
                createdAt={msg.createdAt}
              />
            ))}
          </div>
        </div>

        {/* 메시지 입력 영역 */}
        <ChatInput message={message} onChange={handleMessageChange} onSend={handleSendMessage} />
      </div>
    </FriendModal>
  );
};

export default FriendChatModal;
