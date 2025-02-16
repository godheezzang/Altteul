// FriendListContent.tsx
import React, { useEffect, useState } from 'react';
import FriendListItem from '@components/Friend/FriendListItem';
import { searchUsers } from '@utils/Api/friendApi';
import { Friend, SearchedUser, UserSearchResponse } from 'types/types';
import { api } from '@utils/Api/commonApi';

interface FriendListContentProps {
  searchQuery: string;
}

const FriendListContent = ({ searchQuery }: FriendListContentProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<UserSearchResponse['data']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);

  const handleChat = (friendId: number) => {
    // 필요한 경우 추가 로직
  };

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

  // 사용자 검색 함수 추가
  const searchUsers = async (nickname: string) => {
    try {
      const token = localStorage.getItem('jwtToken'); // jwt 토큰을 로컬스토리지나 다른 곳에서 가져온다고 가정
      const { data } = await api.get<UserSearchResponse>('/user/search', {
        params: { nickname },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.status === 200) {
        setSearchResults(data.data); // 응답 받은 사용자 정보를 상태에 저장
      } else {
        setSearchResults([]); // 실패 시 검색 결과 비우기
      }
    } catch (error) {
      console.error('유저 검색 실패:', error);
      setSearchResults([]); // 오류가 발생하면 검색 결과 비우기
    }
  };
  useEffect(() => {
    fetchFriends();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);

    // 검색어가 있으면 사용자 검색 수행
    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleDeleteFriend = () => {
    fetchFriends(); // 친구 삭제 후 목록을 다시 불러오기
  };

  const handleLoadMore = () => {
    if (!isLoading && !isLast) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // 검색 결과가 있으면 검색 결과 표시, 없으면 기존 친구 목록 필터링
  const displayItems = searchQuery.trim()
    ? searchResults
    : friends.filter(friend => friend.nickname.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col gap-4">
      {isLoading && currentPage === 0 ? (
        <p className="text-center text-gray-03">로딩 중...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : displayItems.length > 0 ? (
        <>
          {displayItems.map(item => (
            <FriendListItem
              key={'userId' in item ? item.userId : item.friendId}
              friendId={'userId' in item ? item.userId : item.friendId}
              nickname={'nickname' in item ? item.nickname : item.nickname}
              profileImg={'profileImage' in item ? item.profileImage : item.profileImg}
              isOnline={'isOnline' in item ? item.isOnline : item.isOnline}
              onDeleteFriend={handleDeleteFriend}
              showFriendRequest={'userId' in item} // 검색 결과일 경우 친구 신청 버튼 표시
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
