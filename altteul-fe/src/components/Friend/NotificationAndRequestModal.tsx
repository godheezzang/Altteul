import { useState, useEffect } from 'react';
import FriendModal from '@components/Friend/FriendModal';
import FriendRequestItem from '@components/Friend/FriendRequestItem';

import SmallButton from '@components/Common/Button/SmallButton ';
import { useFriendRequests } from 'Hooks/useFriendRequests';
import { useGameInvites } from 'Hooks/useGameInvites';
import useAuthStore from '@stores/authStore';

type NotificationAndRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NotificationAndRequestModal = ({ isOpen, onClose }: NotificationAndRequestModalProps) => {
  const [activeTab, setActiveTab] = useState<'friendRequests' | 'gameInvites'>('friendRequests');
  const { userId } = useAuthStore();

  const {
    friendRequests,
    isLoading: friendRequestsLoading,
    error: friendRequestsError,
    handleAcceptRequest,
    handleRejectRequest,
    fetchFriendRequests,
    loadMore,
    isLast,
  } = useFriendRequests();

  const {
    gameInvites,
    isLoading: gameInvitesLoading,
    error: gameInvitesError,
    handleAcceptInvite,
    handleRejectInvite,
  } = useGameInvites(Number(userId));

  // 모달이 열릴 때 친구 요청 목록 가져오기
  useEffect(() => {
    if (isOpen) {
      fetchFriendRequests();
    }
  }, [isOpen, fetchFriendRequests]);

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
        {activeTab === 'friendRequests' && (
          <div>
            {friendRequestsLoading ? (
              <p className="text-center text-gray-03">로딩 중...</p>
            ) : friendRequestsError ? (
              <p className="text-center text-primary-orange">{friendRequestsError}</p>
            ) : friendRequests.length > 0 ? (
              <>
                {friendRequests.map(request => (
                  <FriendRequestItem
                    key={request.friendRequestId}
                    friendId={request.fromUserId}
                    nickname={request.fromUserNickname}
                    profileImg={request.fromUserProfileImg}
                    isOnline={false}
                    onAccept={() => handleAcceptRequest(request.friendRequestId)}
                    onReject={() => handleRejectRequest(request.friendRequestId)}
                  />
                ))}
                {!isLast && (
                  <button
                    onClick={loadMore}
                    disabled={friendRequestsLoading}
                    className="w-full text-gray-02 hover:text-gray-03 py-2 mt-4"
                  >
                    {friendRequestsLoading ? '불러오는 중...' : '더 보기'}
                  </button>
                )}
              </>
            ) : (
              <p className="text-center text-gray-03">친구 요청이 없습니다.</p>
            )}
          </div>
        )}
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
