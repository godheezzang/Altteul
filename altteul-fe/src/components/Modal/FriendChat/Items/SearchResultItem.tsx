import { useSocketStore } from '@stores/socketStore';
import { useState } from 'react';

interface SearchResultItemProps {
  user: {
    userId: number;
    nickname: string;
    profileImg: string;
    isOnline: boolean;
  };
}

const SearchResultItem = ({ user }: SearchResultItemProps) => {
  const { sendMessage } = useSocketStore();
  const [isClick, setIsClick] = useState(false);

  const requestFriend = () => {
    setIsClick(true);
    sendMessage('/pub/friend/request', {
      toUserId: user.userId,
    });
  };

  return (
    <div className="flex items-center justify-between bg-gray-04 p-3 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={user.profileImg} alt="프로필" className="w-10 h-10 rounded-full" />
          <div
            className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 ${
              user.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <p className="font-semibold text-primary-white">{user.nickname}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={requestFriend}
          className={
            !isClick
              ? 'px-3 py-1 bg-primary-orange text-white rounded hover:bg-primary-orange/80'
              : 'px-3 py-1 bg-gray text-white rounded border border-primary-orange'
          }
          disabled = {isClick}
        >
          친구 신청
        </button>
      </div>
    </div>
  );
};

export default SearchResultItem;
