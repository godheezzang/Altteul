// src/components/Modal/Chat/tabs/NotificationTab.tsx
import { useState, useEffect } from 'react';
import useFriendChatStore from '@stores/friendChatStore';
import FriendRequestItem from '@components/Modal/FriendChat/Items/FriendRequestItem';
import GameInviteItem, { GameInvite } from '../Items/GameInviteItem';
import { getFriendRequests } from '@utils/Api/friendChatApi';
import { FriendRequest } from 'types/types';

const NotificationTab = () => {
  const { notificationTab, setNotificationTab } = useFriendChatStore();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [gameInvites, setGameInvites] = useState<GameInvite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 알림 데이터 가져오기
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      if (notificationTab === 'friendRequests') {
        const response = await getFriendRequests({page:0, size:10});
        setFriendRequests(response.data.data.friendRequests);
      } 
      // else {
      //   const response = await getGameInvites();
      //   setGameInvites(response.data);
      // }
    } catch (error) {
      console.error('알림 로드 실패:', error);
      setError('알림을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 탭 변경 시 데이터 새로고침
  useEffect(() => {
    fetchNotifications();
  }, [notificationTab]);

  //친구 요청 수락/거절시 리스트에서 제거
  const updateNotifications = (friendRequestId:number) => {
    setFriendRequests((prev) => prev.filter((friendRequest) => friendRequest.friendRequestId !== friendRequestId))
  }

  return (
    <div className="flex flex-col h-full">
      {/* 알림 타입 선택 탭 */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setNotificationTab('friendRequests')}
          className={`flex-1 py-3 text-center transition-colors ${
            notificationTab === 'friendRequests'
              ? 'text-primary-orange border-b-2 border-primary-orange'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          친구 요청
        </button>
        <button
          onClick={() => setNotificationTab('gameInvites')}
          className={`flex-1 py-3 text-center transition-colors ${
            notificationTab === 'gameInvites'
              ? 'text-primary-orange border-b-2 border-primary-orange'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          게임 초대
        </button>
      </div>

      {/* 알림 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="text-center text-gray-400 py-4">로딩 중...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <div className="space-y-4">
            {notificationTab === 'friendRequests' ? (
              // 친구 요청 목록
              friendRequests.length !== 0 ? (
                friendRequests.map(request => (
                  <FriendRequestItem
                    key={request.friendRequestId}
                    request={request}
                    onRefresh={updateNotifications}
                  />
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  새로운 친구 요청이 없습니다.
                </div>
              )
            ) : (
              // 게임 초대 목록
              gameInvites.length > 0 ? (
                gameInvites.map(invite => (
                  <GameInviteItem
                    key={invite.id}
                    invite={invite}
                    onRefresh={fetchNotifications}
                  />
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  새로운 게임 초대가 없습니다.
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTab;