// ChatHeader.tsx
// 채팅창 상단

import React from 'react';

type ChatHeaderProps = {
  profileImg: string;
  nickname: string;
  isOnline: boolean;
};

const ChatHeader = ({ profileImg, nickname, isOnline }: ChatHeaderProps) => {
  return (
    <div className="border-b border-primary-orange p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={profileImg} alt="프로필" className="w-10 h-10 rounded-full" />
          <div // 온라인 표시 상단 오른쪽으로 옮기기. 색상체크
            className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 ${
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <span className="font-semibold text-lg text-primary-white">{nickname}</span>
      </div>
    </div>
  );
};

export default ChatHeader;
