// components/friend/components/ChatMessage.tsx
// 채팅 메시지 컴포넌트

import React from 'react';

type ChatMessageProps = {
  chatMessageId: number;
  senderId: number;
  messageContent: string;
  createdAt: string;
};

const ChatMessage = ({ senderId, messageContent, createdAt }: ChatMessageProps) => {
  const isMine = senderId === 0;

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isMine ? 'bg-primary-orange text-white' : 'bg-primary-white text-primary-black'
        }`}
      >
        <p className="mb-1">{messageContent}</p>
        <div className="text-xs text-right opacity-80">
          {new Date(createdAt).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
