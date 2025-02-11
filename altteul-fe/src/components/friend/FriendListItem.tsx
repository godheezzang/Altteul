// components/friend/components/FriendListItem.tsx

import React from "react";
import SmallButton from "@components/common/Button/SmallButton ";

type FriendListItemProps = {
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
  onInvite: (friendId: number, nickname: string) => void;
  isInviting: boolean;
};

const FriendListItem = ({
  friendId,
  nickname,
  profileImg,
  isOnline,
  onInvite,
  isInviting,
}: FriendListItemProps) => {
  return (
    <div className="flex items-center justify-between bg-gray-04 p-3 rounded-lg shadow-md">
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <img
            src={profileImg}
            alt="친구 프로필"
            className="w-10 h-10 rounded-full"
          />
          <div
            className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div>
          <p className="font-semibold text-primary-white">{nickname}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <SmallButton
          onClick={() => onInvite(friendId, nickname)}
          disabled={isInviting}
        >
          {isInviting ? "초대중..." : "게임 초대"}
        </SmallButton>
      </div>
    </div>
  );
};

export default FriendListItem;