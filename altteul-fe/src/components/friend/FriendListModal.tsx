import React, { useEffect, useState } from "react";
import FriendModal from "@components/friend/FriendModal";
import SmallButton from "@components/common/Button/SmallButton ";
import { mockChatRooms } from "mocks/friendData";
import useModalStore from "@stores/modalStore";

type FriendListModalProps = {
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

const FriendListModal = ({ isOpen, onClose }: FriendListModalProps) => {
  const [friends, setFriends] = useState<Friend[]>([]); // 친구 목록 상태
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [invitingFriends, setInvitingFriends] = useState<Set<number>>(
    new Set()
  ); // 초대중인 친구 추적

  // mockChatRooms 데이터를 사용
  const fetchFriends = () => {
    setIsLoading(true);
    try {
      if (!mockChatRooms) {
        throw new Error("mockChatRooms 데이터가 존재하지 않습니다.");
      }
      setFriends(mockChatRooms);
      setError(null); // 성공 시 에러 상태 초기화
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError("목 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // 검색 기능 적용
  const filteredFriends = friends.filter((friend) =>
    friend.nickname.includes(searchQuery)
  );

  // 친구 초대
  const handleInvite = (friendId: number, nickname: string) => {
    setInvitingFriends((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(friendId)) {
        newSet.delete(friendId); // 이미 초대 중이면 제거
        console.log(`${nickname} 게임 초대 취소`);
      } else {
        newSet.add(friendId); // 초대 중이 아니면 추가
        console.log(`${nickname} 게임 초대`);
      }
      return newSet;
    });
    console.log(`${nickname} 게임 초대`);
  };

  return (
    <FriendModal
      isOpen={isOpen}
      onClose={onClose}
      showSearch
      onSearch={setSearchQuery}
      showNavigation={true}
    >
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p className="text-center text-gray-600">로딩 중...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div
              key={friend.friendId}
              className="flex items-center justify-between bg-gray-04 p-3 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-3">
                {/* 프로필 이미지와 접속 상태 표시 */}
                <div className="relative">
                  <img
                    src={friend.profileImg}
                    alt="친구 프로필"
                    className="w-10 h-10 rounded-full"
                  />
                  <div
                    className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 ${
                      friend.isOnline ? "bg-green-500" : "bg-gray-400" // 회색 여기서는 이게 더 나은 듯
                    }`}
                  />
                </div>

                <div>
                  {/* 유저 이름과 최근 메시지 */}
                  <p className="font-semibold text-primary-white">
                    {friend.nickname}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <SmallButton
                  onClick={() => handleInvite(friend.friendId, friend.nickname)}
                  disabled={invitingFriends.has(friend.friendId)}
                >
                  {invitingFriends.has(friend.friendId)
                    ? "초대중..."
                    : "게임 초대"}
                </SmallButton>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-03">검색 결과가 없습니다.</p>
        )}
      </div>
    </FriendModal>
  );
};

export default FriendListModal;
