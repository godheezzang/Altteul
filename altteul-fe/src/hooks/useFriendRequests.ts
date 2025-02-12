// hooks/useFriendRequests.ts
// 친구요청

import { useState, useCallback } from 'react';
import { FriendRequest } from 'types/types';

interface UseFriendRequestsReturn {
  friendRequests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
  handleAcceptRequest: (requestId: number) => Promise<void>;
  handleRejectRequest: (requestId: number) => Promise<void>;
  fetchFriendRequests: () => Promise<void>;
}

export const useFriendRequests = (): UseFriendRequestsReturn => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('api/friend/request');
      const data = await response.json();
      setFriendRequests(data.data.friendRequests);
    } catch (err) {
      setError('친구 요청을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await fetch('/pub/friend/request/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendRequestId: requestId,
          requestStatus: 'A',
        }),
      });
      setFriendRequests(prev => prev.filter(request => request.friendRequestId !== requestId));
    } catch (err) {
      setError('친구 요청 수락에 실패했습니다.');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await fetch('/pub/friend/request/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendRequestId: requestId,
          requestStatus: 'R',
        }),
      });
      setFriendRequests(prev => prev.filter(request => request.friendRequestId !== requestId));
    } catch (err) {
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
