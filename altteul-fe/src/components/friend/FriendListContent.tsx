// components/friend/FriendListContent.tsx
import React, { useEffect, useState } from "react";
import FriendListItem from "./FriendListItem";
import { mockChatRooms } from "mocks/friendData";

type FriendListContentProps = {
  searchQuery: string;
};

const FriendListContent = ({ searchQuery }: FriendListContentProps) => {
  const [friends, setFriends] = useState(mockChatRooms);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitingFriends, setInvitingFriends] = useState<Set<number>>(new Set());

  // 검색어를 사용하여 친구 목록 필터링
  const filteredFriends = friends.filter(friend =>
    friend.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = () => {
    setIsLoading(true);
    try {
      if (!mockChatRooms) {
        throw new Error("mockChatRooms 데이터가 존재하지 않습니다.");
      }
      setFriends(mockChatRooms);
      setError(null);
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError("목 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = (friendId: number, nickname: string) => {
    setInvitingFriends((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(friendId)) {
        newSet.delete(friendId);
        console.log(`${nickname} 게임 초대 취소`);
      } else {
        newSet.add(friendId);
        console.log(`${nickname} 게임 초대`);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <p className="text-center text-gray-600">로딩 중...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredFriends.length > 0 ? (
        filteredFriends.map((friend) => (
          <FriendListItem
            key={friend.friendId}
            {...friend}
            onInvite={handleInvite}
            isInviting={invitingFriends.has(friend.friendId)}
          />
        ))
      ) : (
        <p className="text-center text-gray-03">검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default FriendListContent;