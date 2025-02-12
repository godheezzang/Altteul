// 채팅창 모달

import React, { useState, useEffect, useRef } from 'react';
// import FriendModal from '@components/Friend/FriendModal';
import BaseModal from '@components/Friend/Friend_common/Basemodal';
import ChatHeader from '@components/Friend/Chat/ChatHeader';
import ChatMessage from '@components/Friend/Chat/ChatMessage';
import ChatInput from '@components/Friend/Chat/ChatInput';

import { mockChatRoomDetail } from 'Mocks/friendData';

type FriendChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  friendId?: number;
};

const FriendChatModal = ({ isOpen, onClose, friendId = 1 }: FriendChatModalProps) => {
  const [message, setMessage] = useState('');
  const [currentChat, setCurrentChat] = useState(mockChatRoomDetail);
  const [chatHistory, setChatHistory] = useState(mockChatRoomDetail.messages);

  // 스크롤을 위한 Ref 추가
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 메시지 목록이 변경될 때마다 스크롤 맨 아래로 이동
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

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
    <BaseModal isOpen={isOpen} onClose={onClose} showBackButton={true} onBack={onClose}>
      <div className="flex flex-col h-full">
        {/* 채팅방 헤더 */}
        <ChatHeader
          profileImg={currentChat.profileImg}
          nickname={currentChat.nickname}
          isOnline={currentChat.isOnline}
        />

        {/* 채팅 메시지 영역 */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-white scrollbar-track-gray-03 hover:scrollbar-thumb-primary-orange/80"
        >
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
    </BaseModal>
  );
};

export default FriendChatModal;
