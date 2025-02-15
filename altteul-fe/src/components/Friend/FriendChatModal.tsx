import React, { useState, useEffect, useRef } from 'react';
import BaseModal from '@components/Friend/friend_common/Basemodal';
import ChatHeader from '@components/Friend/chat/ChatHeader';
import ChatMessage from '@components/Friend/chat/ChatMessage';
import ChatInput from '@components/Friend/chat/ChatInput';
import { getChatRoomDetail } from '@utils/Api/chatApi';
import type { ChatRoomDetail, ChatMessage as ChatMessageType } from 'types/types';

interface FriendChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendId: number;
}

const FriendChatModal = ({ isOpen, onClose, friendId }: FriendChatModalProps) => {
  const [message, setMessage] = useState('');
  const [chatRoom, setChatRoom] = useState<ChatRoomDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fetchChatRoom = async () => {
    setIsLoading(true);
    try {
      const response = await getChatRoomDetail(friendId);
      if (response.status === 200) {
        setChatRoom(response.data);
      } else {
        throw new Error('채팅방 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('채팅방 조회 실패:', error);
      setError(error instanceof Error ? error.message : '채팅방을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && friendId) {
      fetchChatRoom();
    }
  }, [isOpen, friendId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatRoom?.messages]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() && chatRoom) {
      // TODO: 메시지 전송 API 연동
      const newMessage: ChatMessageType = {
        chatMessageId: Date.now(),
        senderId: 0, // 현재 사용자 ID로 수정 필요
        senderNickname: '나',
        messageContent: message,
        checked: false,
        createdAt: new Date().toISOString(),
      };
      setChatRoom(prev => (prev ? { ...prev, messages: [...prev.messages, newMessage] } : null));
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
        ) : chatRoom ? (
          <>
            <ChatHeader
              profileImg={chatRoom.profileImg}
              nickname={chatRoom.nickname}
              isOnline={chatRoom.isOnline}
            />

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-white scrollbar-track-gray-03 hover:scrollbar-thumb-primary-orange/80"
            >
              <div className="p-4 space-y-4">
                {chatRoom.messages.map(msg => (
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
