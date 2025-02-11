// components/friend/FriendRequestModal.tsx
import React from 'react';
import FriendModal from '@components/friend/FriendModal';
import FriendRequestItem from '@components/friend/FriendRequestItem';
import { mockFriendRequests } from 'mocks/friendData';

type FriendRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FriendRequestModal = ({ isOpen, onClose }: FriendRequestModalProps) => {
  const handleAccept = (friendId: number, nickname: string) => {
    console.log(`${nickname} 수락됨`); // 실제 API 호출 필요
  };

  const handleReject = (friendId: number, nickname: string) => {
    console.log(`${nickname} 거절됨`); // 실제 API 호출 필요
  };

  return (
    <FriendModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-primary-white mb-4">친구 신청</h2>
        {mockFriendRequests.length > 0 ? (
          mockFriendRequests.map(request => (
            <FriendRequestItem
              key={request.friendRequestId}
              friendId={request.fromUserId}
              nickname={request.fromUserNickname}
              profileImg={request.fromUserProfileImg}
              isOnline={false} // 온라인 상태는 별도로 처리 필요
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))
        ) : (
          <p className="text-center text-gray-03">받은 친구 신청이 없습니다.</p>
        )}
      </div>
    </FriendModal>
  );
};

export default FriendRequestModal;
