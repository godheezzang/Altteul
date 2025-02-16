import React, { useState, useEffect, useRef } from 'react';
import BaseModal from '@components/Friend/Friend_common/Basemodal';
import ChatHeader from '@components/Friend/Chat/ChatHeader';
import ChatMessage from '@components/Friend/Chat/ChatMessage';
import ChatInput from '@components/Friend/Chat/ChatInput';
import useChatStore from '@stores/chatStore';
import useAuthStore from '@stores/authStore';
import { useSocketStore } from '@stores/socketStore';

interface FriendChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendId: number;
}

const FriendChatModal = ({ isOpen, onClose, friendId }: FriendChatModalProps) => {
  const [message, setMessage] = useState('');
  const { currentChatRoom, fetchChatRoomDetail, addMessage, isLoading, error } = useChatStore();
  const { userId } = useAuthStore();
  const { sendMessage } = useSocketStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴때만 채팅 데이터를 가져옴
  useEffect(() => {
    if (isOpen && friendId) {
      fetchChatRoomDetail(friendId);
    }
  }, [isOpen, friendId, fetchChatRoomDetail]);

  // 채팅이 추가되면 자동으로 맨 밑으로 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChatRoom?.messages]);

  // 메시지 작성
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // 메시지 전송
  const handleSendMessage = () => {
    if (message.trim() && currentChatRoom) {
      // 소켓으로 메시지 전송
      const newMessage = {
        chatMessageId: Date.now(),
        senderId: Number(userId),
        senderNickname: '나',
        messageContent: message,
        checked: false,
        createdAt: new Date().toISOString(),
      };

      // 소켓으로 메시지 전송 로직 추가
      sendMessage('/pub/chat/send', {
        friendId,
        message: newMessage.messageContent,
      });

      // 로컬 상태에 메시지 추가
      addMessage(newMessage);
      setMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} showBackButton={true} onBack={onClose}>
      <div className="flex flex-col h-full">
        {isLoading ? (
          <p className="text-center text-gray-03">로딩 중...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : currentChatRoom ? (
          <>
            <ChatHeader
              profileImg={currentChatRoom.profileImg}
              nickname={currentChatRoom.nickname}
              isOnline={currentChatRoom.isOnline}
            />

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-white scrollbar-track-gray-03 hover:scrollbar-thumb-primary-orange/80"
            >
              <div className="p-4 space-y-4">
                {currentChatRoom.messages.map(msg => (
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

            <ChatInput
              message={message}
              onChange={handleMessageChange}
              onSend={handleSendMessage}
            />
          </>
        ) : null}
      </div>
    </BaseModal>
  );
};

export default FriendChatModal;
