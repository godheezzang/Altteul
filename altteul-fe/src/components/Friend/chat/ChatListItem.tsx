// components/friend/chat/ChatListItem.tsx
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
  isFriend?: boolean;
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
  isFriend = false,
}: ChatListItemProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const { sendMessage } = useSocketStore();
  const { userId } = useAuthStore();

  const handleClick = () => {
    onSelect?.(friendId);
  };

  return (
    <div
      className="flex items-center gap-3 py-3 px-2 border-b border-gray-03 cursor-pointer hover:bg-gray-05 transition-colors duration-200"
      onClick={handleClick}
    >
      <div className="relative flex-shrink-0">
        <img src={profileImg} alt={`${nickname} 프로필`} className="w-12 h-12 rounded-full" />
        <div
          className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-gray-01 ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p
            className={`font-medium ${
              isMessageRead ? 'text-primary-white' : 'text-primary-orange'
            }`}
          >
            {nickname}
          </p>{' '}
          <p className="text-xs text-gray-02">
            {new Date(createdAt).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <p
          className={`text-sm truncate ${
            isMessageRead ? 'text-gray-02' : 'text-primary-white font-semibold'
          }`}
        >
          {recentMessage}
        </p>
      </div>
    </div>
  );
};

export default ChatListItem;
