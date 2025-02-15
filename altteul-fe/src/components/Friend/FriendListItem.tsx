// FriendListItem.tsx
import React, { useState } from 'react';
import SmallButton from '@components/common/Button/SmallButton ';
import { useSocketStore } from '@stores/socketStore';
import { getChatRoomDetail } from '@utils/Api/chatApi';
import useAuthStore from '@stores/authStore';

type FriendListItemProps = {
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
  showFriendRequest?: boolean;
};

const FriendListItem = ({
  friendId,
  nickname,
  profileImg,
  isOnline,
  showFriendRequest,
}: FriendListItemProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const socketStore = useSocketStore(); // socketStore 훅 사용
  const { sendMessage } = socketStore; // sendMessage 메서드 추출

  const { userId } = useAuthStore();

  const handleFriendRequest = async () => {
    try {
      setIsRequesting(true);
      // 친구 신청 로직
    } catch (error) {
      console.error('친구 신청 실패:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleInvite = () => {
    setIsInviting(prev => !prev);
    console.log(`${nickname} ${!isInviting ? '게임 초대' : '게임 초대 취소'}`);
  };

  const handleDeleteFriend = async () => {
    try {
      const payload = { userId, friendId };
      sendMessage('/pub/friend/delete', payload); // socketStore의 sendMessage 사용
      console.log('친구 삭제 요청 전송', payload);
    } catch (error) {
      console.error('친구 삭제 실패:', error);
    }
  };

  // 채팅으로 이동
  const handleChat = async () => {
    try {
      const chatRoomData = await getChatRoomDetail(friendId);
      console.log('채팅방 데이터:', chatRoomData);
    } catch (error) {
      console.error('채팅방 조회 실패:', error);
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
          <SmallButton onClick={handleInvite} disabled={isInviting}>
            {isInviting ? '초대중...' : '게임 초대'}
          </SmallButton>
        )}
        <SmallButton onClick={handleChat}>대화하기</SmallButton>
        <SmallButton onClick={handleDeleteFriend}>친구 삭제</SmallButton>
      </div>
    </div>
  );
};

export default FriendListItem;
