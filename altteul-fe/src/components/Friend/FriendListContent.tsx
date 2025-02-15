// FriendListContent.tsx
import React, { useEffect, useState } from 'react';
import FriendListItem from '@components/Friend/FriendListItem';
import { getFriends } from '@utils/Api/friendApi';
import { Friend } from 'types/types';

interface FriendListContentProps {
  searchQuery: string;
}

const FriendListContent = ({ searchQuery }: FriendListContentProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await getFriends({ page: currentPage });
      console.log('친구 목록 응답:', response);

      if (response.status === 200) {
        setFriends(prev =>
          currentPage === 0 ? response.data.friends : [...prev, ...response.data.friends]
        );
        setIsLast(response.data.isLast);
      } else {
        throw new Error('서버 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('친구 목록 조회 실패:', error);
      setError(error instanceof Error ? error.message : '친구 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const filteredFriends = friends.filter(friend =>
    friend.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    if (!isLoading && !isLast) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoading && currentPage === 0 ? (
        <p className="text-center text-gray-03">로딩 중...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredFriends.length > 0 ? (
        <>
          {filteredFriends.map(friend => (
            <FriendListItem
              key={friend.userId}
              friendId={friend.userId}
              nickname={friend.nickname}
              profileImg={friend.profileImg}
              isOnline={friend.isOnline}
            />
          ))}
          {!isLast && (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className={`text-gray-02 hover:text-gray-03 transition-colors py-2 ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isLoading ? '불러오는 중...' : '더 보기'}
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-gray-03">검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default FriendListContent;
