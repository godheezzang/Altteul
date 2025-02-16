import { useState, useCallback } from 'react';
import { getFriendRequests } from '@utils/Api/friendApi';
import { FriendRequest } from 'types/types';

export const useFriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);

  const fetchFriendRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getFriendRequests({ page: currentPage });
      console.log('친구 요청 목록 응답:', response); // 개발 시 확인용

      if (response.status === '200 OK') {
        setFriendRequests(prev =>
          currentPage === 0
            ? response.data.friendRequests
            : [...prev, ...response.data.friendRequests]
        );
        setIsLast(response.data.isLast);
      } else {
        throw new Error('서버 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('친구 요청 목록 조회 실패:', error);
      setError(
        error instanceof Error ? error.message : '친구 요청 목록을 불러오는데 실패했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  const loadMore = useCallback(() => {
    if (!isLoading && !isLast) {
      setCurrentPage(prev => prev + 1);
    }
  }, [isLoading, isLast]);

  const handleAcceptRequest = async (friendRequestId: number) => {
    // TODO: 친구 요청 수락 API 구현
    console.log('친구 요청 수락:', friendRequestId);
  };

  const handleRejectRequest = async (friendRequestId: number) => {
    // TODO: 친구 요청 거절 API 구현
    console.log('친구 요청 거절:', friendRequestId);
  };

  return {
    friendRequests,
    isLoading,
    error,
    isLast,
    fetchFriendRequests,
    loadMore,
    handleAcceptRequest,
    handleRejectRequest,
  };
};
