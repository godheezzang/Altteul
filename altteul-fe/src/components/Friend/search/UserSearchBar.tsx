import useAuthStore from '@stores/authStore';
import { useSocketStore } from '@stores/socketStore';
import React, { useState } from 'react';

type SearchBarProps = {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void | boolean;
};

const UserSearchBar = ({ placeholder, value, onChange, onSearch }: SearchBarProps) => {
  const { searchQuery, handleSearch, searchResults, isLoading } = useUserSearch();
  const { sendMessage } = useSocketStore();
  const { userId } = useAuthStore();

  // 친구 신청 중인 사용자 ID 추적
  const [requestingUsers, setRequestingUsers] = useState<Set<number>>(new Set());

  const currentQuery = value ?? searchQuery;
  const currentHandleSearch = onChange
    ? (e: React.ChangeEvent<HTMLInputElement>) => onChange(e)
    : (e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value);

  // 친구 신청 핸들러
  const handleFriendRequest = async (targetUserId: number, nickname: string) => {
    try {
      // 친구 신청 중 상태 업데이트
      setRequestingUsers(prev => new Set(prev).add(targetUserId));

      // 소켓으로 친구 신청 메시지 전송 //////////////////////////////////////
      sendMessage('/pub/friend/request', {
        fromUserId: userId,
        toUserId: targetUserId,
      });
      console.log(`${nickname}에게 친구 신청 완료`);
    } catch (error) {
      console.error('친구 신청 실패:', error);
    } finally {
      // 친구 신청 중 상태 해제
      setRequestingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUserId);
        return newSet;
      });
    }
  };
  return (
    <div className="relative mb-5">
      <input
        type="text"
        value={currentQuery}
        onChange={currentHandleSearch}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            if (onSearch) {
              onSearch();
            } else {
              handleSearch(currentQuery);
            }
          }
        }}
        placeholder={placeholder}
        className="friend-input pr-10 py-2 pl-4 border border-primary-orange rounded-md w-full text-primary-black"
      />
      <button
        onClick={() => (onSearch ? onSearch() : handleSearch(currentQuery))}
        disabled={isLoading}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-orange text-xl"
      >
        <img src="src/assets/icon/Search_orange.svg" alt="search" className="w-5 h-5" />
      </button>

      {isLoading ? (
        <div className="absolute z-10 w-full mt-1 p-2 text-center text-gray-03">검색 중...</div>
      ) : (
        currentQuery &&
        searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-06 border border-primary-orange rounded-md shadow-lg">
            {searchResults.map(user => (
              <div
                key={user.userId}
                className="px-4 py-2 hover:bg-gray-04 cursor-pointer text-primary-white flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <img src={user.profileImage} alt="프로필" className="w-8 h-8 rounded-full" />
                  <span>{user.nickname}</span>
                </div>
                {/* 친구가 아닌 경우에만 친구 신청 버튼 표시 */}
                {!user.isFriend && (
                  <button
                    onClick={() => handleFriendRequest(user.userId, user.nickname)}
                    disabled={requestingUsers.has(user.userId)}
                    className="bg-primary-orange text-white px-2 py-1 rounded-md text-sm"
                  >
                    {requestingUsers.has(user.userId) ? '신청 중...' : '친구 신청'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default UserSearchBar;
