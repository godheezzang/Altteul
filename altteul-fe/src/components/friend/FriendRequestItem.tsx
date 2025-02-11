// components/friend/components/FriendRequestItem.tsx

import React from "react";
import SmallButton from "@components/common/Button/SmallButton ";

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
    <div className="flex items-center justify-between bg-primary-white p-3 rounded-lg shadow-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={profileImg}
            alt="친구 프로필"
            className="w-10 h-10 rounded-full"
          />
          <div
            className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div>
          <p className="font-semibold text-primary-black">{nickname}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <SmallButton
          onClick={() => onAccept(friendId, nickname)}
          backgroundColor="primary-orange"
        >
          수락
        </SmallButton>
        <SmallButton
          onClick={() => onReject(friendId, nickname)}
          backgroundColor="gray-400"
        >
          거절
        </SmallButton>
      </div>
    </div>
  );
};

export default FriendRequestItem;