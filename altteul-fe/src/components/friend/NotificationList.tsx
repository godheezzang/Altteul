// components/friend/components/NotificationList.tsx
import React from 'react';

type Notification = {
  id: number;
  type: 'gameInvite' | 'friendRequest';
  from: {
    id: number;
    nickname: string;
    profileImg: string;
  };
  createdAt: string;
};

type NotificationListProps = {
  notifications: Notification[];
  onAcceptFriend: (userId: number) => void;
  onRejectFriend: (userId: number) => void;
  onAcceptGame: (userId: number) => void;
  onRejectGame: (userId: number) => void;
};

const NotificationList = ({
  notifications,
  onAcceptFriend,
  onRejectFriend,
  onAcceptGame,
  onRejectGame,
}: NotificationListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="bg-gray-04 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={notification.from.profileImg}
              alt="프로필"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="text-primary-white">
                {notification.from.nickname}
                {notification.type === 'gameInvite' 
                  ? '님이 게임에 초대했습니다'
                  : '님이 친구 신청을 보냈습니다'}
              </p>
              <p className="text-xs text-gray-02">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              {notification.type === 'gameInvite' ? (
                <>
                  <button
                    onClick={() => onAcceptGame(notification.from.id)}
                    className="px-3 py-1 bg-primary-orange text-white rounded"
                  >
                    수락
                  </button>
                  <button
                    onClick={() => onRejectGame(notification.from.id)}
                    className="px-3 py-1 bg-gray-03 text-white rounded"
                  >
                    거절
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onAcceptFriend(notification.from.id)}
                    className="px-3 py-1 bg-primary-orange text-white rounded"
                  >
                    수락
                  </button>
                  <button
                    onClick={() => onRejectFriend(notification.from.id)}
                    className="px-3 py-1 bg-gray-03 text-white rounded"
                  >
                    거절
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;