// 채팅 목록 아이템 컴포넌트
// ChatListItem.tsx

import React from 'react';

type ChatListItemProps = {
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
  recentMessage: string;
  isMessageRead: boolean;
  createdAt: string;
  onSelect?: (friendId: number) => void;
};

const ChatListItem = ({
  friendId,
  profileImg,
  nickname,
  isOnline,
  recentMessage,
  isMessageRead,
  createdAt,
  onSelect,
}: ChatListItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(friendId);
  };
  return (
    <div
      className="flex items-center gap-3 p-2 border-b cursor-pointer hover:bg-gray-04"
      onClick={handleClick}
    >
      <div className="relative">
        <img src={profileImg} alt={`${nickname} 프로필`} className="w-12 h-12 rounded-full" />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
        )}
      </div>

      <div className="flex-1">
        <p className="font-medium text-primary-white">{nickname}</p>
        <p
          className={`text-sm ${isMessageRead ? 'text-gray-01' : 'text-primary-orange font-bold'}`}
        >
          {recentMessage}
        </p>
      </div>

      <p className="text-xs text-gray-02">
        {new Date(createdAt).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  );
};

export default ChatListItem;
