import { useState, useEffect } from 'react';
import FriendModal from '@components/Friend/FriendModal';
import FriendRequestItem from '@components/Friend/FriendRequestItem';

import SmallButton from '@components/Common/Button/SmallButton ';
import { useGameInvites } from 'hooks/useGameInvites';
import useAuthStore from '@stores/authStore';

type NotificationAndRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NotificationAndRequestModal = ({ isOpen, onClose }: NotificationAndRequestModalProps) => {
  const [activeTab, setActiveTab] = useState<'friendRequests' | 'gameInvites'>('friendRequests');
  const { userId } = useAuthStore();


  const {
    gameInvites,
    isLoading: gameInvitesLoading,
    error: gameInvitesError,
    handleAcceptInvite,
    handleRejectInvite,
  } = useGameInvites(Number(userId));

  return (
    <FriendModal isOpen={isOpen} onClose={onClose} showSearch={false}>
      <div className="flex flex-col gap-4">
        {/* 탭 선택 버튼 */}
        <div className="flex justify-around mb-4 border-b border-gray-600">
          <button
            className={`pb-2 ${
              activeTab === 'friendRequests'
                ? 'text-primary-orange border-b-2 border-primary-orange'
                : 'text-gray-03'
            }`}
            onClick={() => setActiveTab('friendRequests')}
          >
            친구 요청
          </button>
          <button
            className={`pb-2 ${
              activeTab === 'gameInvites'
                ? 'text-primary-orange border-b-2 border-primary-orange'
                : 'text-gray-03'
            }`}
            onClick={() => setActiveTab('gameInvites')}
          >
            게임 초대
          </button>
        </div>
        {/* 친구 요청 탭 */}

        {/* 게임 초대 탭 */}
        {activeTab === 'gameInvites' && (
          <div>
            {gameInvitesLoading ? (
              <p className="text-center text-gray-03">로딩 중...</p>
            ) : gameInvitesError ? (
              <p className="text-center text-primary-orange">{gameInvitesError}</p>
            ) : gameInvites.length > 0 ? (
              gameInvites.map(invite => (
                <div
                  key={invite.id}
                  className="bg-gray-04 p-3 rounded-lg flex items-center justify-between mb-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={invite.from.profileImg}
                        alt="프로필"
                        className="w-10 h-10 rounded-full"
                      />
                      <div
                        className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-gray-04 ${
                          invite.from.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-primary-white">{invite.from.nickname}</p>
                      <p className="text-xs text-gray-02">게임에 초대했습니다</p>
                      <p className="text-xs text-gray-03">
                        {new Date(invite.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <SmallButton
                      onClick={() => invite.roomId && handleAcceptInvite(invite.id, invite.roomId)}
                      backgroundColor="primary-orange"
                    >
                      수락
                    </SmallButton>
                    <SmallButton
                      onClick={() => handleRejectInvite(invite.id)}
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
