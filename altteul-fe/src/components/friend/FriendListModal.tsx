import React, { useEffect, useState } from "react";
import FriendModal from "@components/friend/FriendModal";
import SmallButton from "@components/common/Button/SmallButton ";
import { mockFriends } from "mocks/friendData";

type FriendListModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Friend = {
  userId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
};

const FriendListModal = ({ isOpen, onClose }: FriendListModalProps) => {
  const [friends, setFriends] = useState<Friend[]>([]); // 친구 목록 상태
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // 친구목록 목데이터 사용중
  const fetchFriends = () => {
    setIsLoading(true);
    try {
      // API 대신 mockFriends 사용
      setFriends(mockFriends);
    } catch (err) {
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

  return (
    <FriendModal
      isOpen={isOpen}
      onClose={onClose}
      showSearch
      onSearch={setSearchQuery}
    >
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p className="text-center text-gray-600">로딩 중...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div
              key={friend.userId}
              className="flex items-center justify-between bg-primary-white p-3 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-3">
                {/* 프로필 이미지와 접속 상태 표시 */}
                <div className="relative">
                  <img
                    src={friend.profileImg || peopleIcon}
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
                  {/* 유저 이름과 매칭 대기 여부 표시 */}
                  <p className="font-semibold text-primary-black">
                    {friend.nickname}
                  </p>
                  <p className="text-lang-PY" style={{ color: "#6164FF" }}>
                    매칭 대기 중
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <SmallButton
                  onClick={() => console.log(`${friend.nickname} 게임 초대`)}
                  width="3.5rem"
                  height="1.8125rem"
                  fontSize="0.75rem"
                >
                  게임 초대
                </SmallButton>
                <SmallButton
                  onClick={() => console.log(`${friend.nickname} 차단`)}
                  width="3.5rem"
                  height="1.8125rem"
                  fontSize="0.75rem"
                >
                  차단
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
