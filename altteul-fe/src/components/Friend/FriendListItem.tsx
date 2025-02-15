import React, { useState } from 'react';
import SmallButton from '@components/Common/Button/SmallButton ';
import { useFriendWebSocket } from 'hooks/useFriendWebSocket';

type FriendListItemProps = {
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
  showFriendRequest?: boolean;
  onInvite: (friendId: number, nickname: string) => void;
  isInviting: boolean;
};

const FriendListItem = ({
  friendId,
  nickname,
  profileImg,
  isOnline,
  showFriendRequest,
  onInvite,
  isInviting,
}: FriendListItemProps) => {
  const { sendFriendRequest } = useFriendWebSocket();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleFriendRequest = async () => {
    try {
      setIsRequesting(true);
      await sendFriendRequest(friendId);
      // 성공 시 처리 (예: 토스트 메시지)
    } catch (error) {
      console.error('친구 신청 실패:', error);
      // 에러 처리
    } finally {
      setIsRequesting(false);
    }
  };
  return (
    <div className="flex items-center justify-between bg-gray-04 p-3 rounded-lg shadow-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={profileImg} alt="프로필" className="w-10 h-10 rounded-full" />
          <div
            className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 ${
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <p className="font-semibold text-primary-white">{nickname}</p>
      </div>

      <div className="flex gap-2">
        {showFriendRequest ? (
          <SmallButton onClick={handleFriendRequest} disabled={isRequesting}>
            {isRequesting ? '요청중...' : '친구 신청'}
          </SmallButton>
        ) : (
          onInvite && (
            <SmallButton onClick={() => onInvite(friendId, nickname)} disabled={isInviting}>
              {isInviting ? '초대중...' : '게임 초대'}
            </SmallButton>
          )
        )}
      </div>
    </div>
  );
};

export default FriendListItem;
