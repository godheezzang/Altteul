// 친구 목록 탭 컴포넌트
// src/components/Modal/Chat/tabs/FriendTab.tsx
import { useState, useEffect } from 'react';
import type { Friend } from 'types/types';
import { getFriends } from '@utils/Api/friendApi';
import FriendItem from '@components/ChatModal/Items/FriendItem';

interface FriendTabProps {
  searchQuery: string;
  onStartChat: (friendId: number) => void;
}

const FriendTab = ({ searchQuery, onStartChat }: FriendTabProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = async () => {
    if (isLoading || isLast) return;

    try {
      setIsLoading(true);
      const response = await getFriends({ page: currentPage });

      if (response.status === 200) {
        setFriends(prev =>
          currentPage === 0 ? response.data.friends : [...prev, ...response.data.friends]
        );
        setIsLast(response.data.isLast);
      }
    } catch (error) {
      console.error('친구 목록 조회 실패:', error);
      setError('친구 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
    setFriends([]);
    setIsLast(false);
  }, [searchQuery]);

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {friends.length > 0 ? (
        <>
          {friends.map(friend => (
            <FriendItem
              friend={friend}
              onRefresh={fetchFriends}
              onStartChat={() => onStartChat(friend.userid)}
            />
          ))}

          {!isLast && (
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="w-full py-2 text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? '로딩 중...' : '더 보기'}
            </button>
          )}
        </>
      ) : (
        <div className="text-center text-gray-400 p-4">
          {searchQuery ? '검색 결과가 없습니다.' : '친구 목록이 비어있습니다.'}
        </div>
      )}
    </div>
  );
};

export default FriendTab;
