import React, { useState } from 'react';
import FriendModal from '@components/friend/FriendModal';
import FriendRequestItem from '@components/friend/FriendRequestItem';
import SmallButton from '@components/common/Button/SmallButton ';
import { mockFriendRequests, mockNotifications } from 'mocks/friendData';

type NotificationAndRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NotificationAndRequestModal = ({ isOpen, onClose }: NotificationAndRequestModalProps) => {
  const [activeTab, setActiveTab] = useState<'friendRequests' | 'gameInvites'>('friendRequests');
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleAcceptFriendRequest = (friendRequestId: number) => {
    const request = friendRequests.find(req => req.friendRequestId === friendRequestId);
    if (request) {
      console.log(`${request.fromUserNickname} 친구 요청 수락`);
      setFriendRequests(prev => prev.filter(req => req.friendRequestId !== friendRequestId));
    }
  };

  const handleRejectFriendRequest = (friendRequestId: number) => {
    const request = friendRequests.find(req => req.friendRequestId === friendRequestId);
    if (request) {
      console.log(`${request.fromUserNickname} 친구 요청 거절`);
      setFriendRequests(prev => prev.filter(req => req.friendRequestId !== friendRequestId));
    }
  };

  const handleAcceptGameInvite = (notificationId: number) => {
    const notification = notifications.find(noti => noti.id === notificationId);
    if (notification) {
      console.log(`${notification.from.nickname} 게임 초대 수락`);
      setNotifications(prev => prev.filter(noti => noti.id !== notificationId));
    }
  };

  const handleRejectGameInvite = (notificationId: number) => {
    const notification = notifications.find(noti => noti.id === notificationId);
    if (notification) {
      console.log(`${notification.from.nickname} 게임 초대 거절`);
      setNotifications(prev => prev.filter(noti => noti.id !== notificationId));
    }
  };

  return (
    <FriendModal isOpen={isOpen} onClose={onClose} showSearch={false}>
      <div className="flex flex-col gap-4">
        {/* 탭 선택 버튼 */}
        <div className="flex justify-around mb-4 border-b border-gray-600">
          <button
            className={`pb-2 ${activeTab === 'friendRequests' ? 'text-primary-orange border-b-2 border-primary-orange' : 'text-gray-03'}`}
            onClick={() => setActiveTab('friendRequests')}
          >
            친구 요청
          </button>
          <button
            className={`pb-2 ${activeTab === 'gameInvites' ? 'text-primary-orange border-b-2 border-primary-orange' : 'text-gray-03'}`}
            onClick={() => setActiveTab('gameInvites')}
          >
            게임 초대
          </button>
        </div>

        {/* 친구 요청 탭 */}
        {activeTab === 'friendRequests' && (
          <div>
            {friendRequests.length > 0 ? (
              friendRequests.map(request => (
                <FriendRequestItem
                  key={request.friendRequestId}
                  friendId={request.fromUserId}
                  nickname={request.fromUserNickname}
                  profileImg={request.fromUserProfileImg}
                  isOnline={false}
                  onAccept={() => handleAcceptFriendRequest(request.friendRequestId)}
                  onReject={() => handleRejectFriendRequest(request.friendRequestId)}
                />
              ))
            ) : (
              <p className="text-center text-gray-03">친구 요청이 없습니다.</p>
            )}
          </div>
        )}

        {/* 게임 초대 탭 */}
        {activeTab === 'gameInvites' && (
          <div>
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className="bg-gray-04 p-3 rounded-lg flex items-center justify-between mb-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={notification.from.profileImg}
                        alt="프로필"
                        className="w-10 h-10 rounded-full"
                      />
                      <div
                        className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-gray-04 ${
                          notification.from.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-primary-white">{notification.from.nickname}</p>
                      <p className="text-xs text-gray-02">게임에 초대했습니다</p>
                      <p className="text-xs text-gray-03">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <SmallButton
                      onClick={() => handleAcceptGameInvite(notification.id)}
                      backgroundColor="primary-orange"
                    >
                      수락
                    </SmallButton>
                    <SmallButton
                      onClick={() => handleRejectGameInvite(notification.id)}
                      backgroundColor="gray-400"
                    >
                      거절
                    </SmallButton>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-03">새로운 게임 초대가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </FriendModal>
  );
};

export default NotificationAndRequestModal;
