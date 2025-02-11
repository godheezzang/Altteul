// ChatInput.tsx
// 채팅 입력하는 인풋

import React from 'react';

type ChatInputProps = {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
};

const ChatInput = ({ message, onChange, onSend }: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-primary-orange p-3">
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          placeholder="채팅을 입력하세요."
          className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-01 focus:outline-none focus:border-primary-orange text-primary-black"
        />
        <button
          onClick={e => {
            e.preventDefault();
            onSend();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
        >
          <img src="src/assets/icon/Send.svg" alt="send message" className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
