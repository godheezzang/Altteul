import React, { useState } from "react";
import FriendModal from "./FriendModal";
import SmallButton from "@components/Common/Button/SmallButton ";
import { mockChatRooms } from "mocks/friendData";

type FriendAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Friend = {
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
  recentMessage: string;
  isMessageRead: boolean;
  createdAt: string;
};

const FriendAddModal = ({ isOpen, onClose }: FriendAddModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingFriends, setPendingFriends] = useState<Friend[]>(mockChatRooms);

  // 검색어에 따른 친구 필터링
  const filteredFriends = pendingFriends.filter((friend) =>
    friend.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 친구 요청 수락
  const handleAccept = (friendId: number, nickname: string) => {
    // 수락 로직 추가 (API 호출 등)
    console.log(`${nickname} 수락됨`);
    // 목록에서 제거
    setPendingFriends((prev) =>
      prev.filter((friend) => friend.friendId !== friendId)
    );
  };

  // 친구 요청 거절
  const handleReject = (friendId: number, nickname: string) => {
    console.log(`${nickname} 거절됨`);
    // 목록에서 제거
    setPendingFriends((prev) =>
      prev.filter((friend) => friend.friendId !== friendId)
    );
  };

  return (
    <FriendModal
      isOpen={isOpen}
      onClose={onClose}
      showSearch={true}
      onSearch={setSearchQuery}
      showNavigation={true}
    >
      <div className="flex flex-col gap-4">
        {filteredFriends.map((friend) => (
          <div
            key={friend.friendId}
            className="flex items-center justify-between bg-primary-white p-3 rounded-lg shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={friend.profileImg}
                  alt="친구 프로필"
                  className="w-10 h-10 rounded-full"
                />
                <div
                  className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    friend.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              <div>
                <p className="font-semibold text-primary-black">
                  {friend.nickname}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <SmallButton
                onClick={() => handleAccept(friend.friendId, friend.nickname)}
                backgroundColor="primary-orange"
              >
                수락
              </SmallButton>
              <SmallButton
                onClick={() => handleReject(friend.friendId, friend.nickname)}
                backgroundColor="gray-400"
              >
                거절
              </SmallButton>
            </div>
          </div>
        ))}

        {filteredFriends.length === 0 && (
          <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
        )}
      </div>
    </FriendModal>
  );
};

export default FriendAddModal;
