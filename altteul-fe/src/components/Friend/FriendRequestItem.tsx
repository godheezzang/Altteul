// components/friend/FriendRequestItem.tsx

import React from 'react';
import SmallButton from '@components/common/Button/SmallButton ';

type FriendRequestItemProps = {
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
  onAccept: (friendId: number, nickname: string) => void;
  onReject: (friendId: number, nickname: string) => void;
};

const FriendRequestItem = ({
  friendId,
  nickname,
  profileImg,
  isOnline,
  onAccept,
  onReject,
}: FriendRequestItemProps) => {
  return (
    <div className="bg-gray-04 p-3 rounded-lg flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={profileImg} alt="친구 프로필" className="w-10 h-10 rounded-full" />
          <div
            className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 ${
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <div>
          <p className="text-primary-white">{nickname}</p>
          <p className="text-xs text-gray-02">친구 요청을 보냈습니다</p>
        </div>
      </div>
      <div className="flex gap-2">
        <SmallButton onClick={() => onAccept(friendId, nickname)} backgroundColor="primary-orange">
          수락
        </SmallButton>
        <SmallButton onClick={() => onReject(friendId, nickname)} backgroundColor="gray-400">
          거절
        </SmallButton>
      </div>
    </div>
  );
};

export default FriendRequestItem;
