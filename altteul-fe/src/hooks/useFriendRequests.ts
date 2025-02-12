// hooks/useFriendRequests.ts
import { useState, useCallback } from 'react';
import { FriendRequest } from 'types/types';
import { authApi } from '@utils/Api/commonApi';

export const useFriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.get('/friend/request');
      setFriendRequests(response.data.data.friendRequests);
    } catch (err) {
      console.error('친구 요청 조회 실패:', err);
      setError('친구 요청을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await authApi.post('/friend/request/process', {
        friendRequestId: requestId,
        requestStatus: 'A',
      });

      // 성공 시 목록에서 해당 요청 제거
      setFriendRequests(prev => prev.filter(request => request.friendRequestId !== requestId));
    } catch (err) {
      console.error('친구 요청 수락 실패:', err);
      setError('친구 요청 수락에 실패했습니다.');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await authApi.post('/friend/request/process', {
        friendRequestId: requestId,
        requestStatus: 'R',
      });

      // 성공 시 목록에서 해당 요청 제거
      setFriendRequests(prev => prev.filter(request => request.friendRequestId !== requestId));
    } catch (err) {
      console.error('친구 요청 거절 실패:', err);
      setError('친구 요청 거절에 실패했습니다.');
    }
  };

  return {
    friendRequests,
    isLoading,
    error,
    handleAcceptRequest,
    handleRejectRequest,
    fetchFriendRequests,
  };
};
