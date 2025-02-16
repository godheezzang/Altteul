// FriendListItem.tsx
import React, { useState } from 'react';
import SmallButton from '@components/Common/Button/SmallButton ';
import { useSocketStore } from '@stores/socketStore';
// import { getChatRoomDetail } from '@utils/Api/chatApi';
import useAuthStore from '@stores/authStore';

type FriendListItemProps = {
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
  showFriendRequest?: boolean;
  onDeleteFriend: (friendId: number) => void;
  onChat?: (friendId: number) => void;
};

const FriendListItem = ({
                          friendId,
                          nickname,
                          profileImg,
                          isOnline,
                          showFriendRequest,
                          onDeleteFriend,
                          onChat,
                        }: FriendListItemProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const socketStore = useSocketStore(); // socketStore 훅 사용
  const { sendMessage } = socketStore; // sendMessage 메서드 추출

  const { userId } = useAuthStore();

  const handleFriendRequest = async () => {
    try {
      setIsRequesting(true);

      // 소켓을 통한 친구 신청
      const payload = {
        toUserId: friendId,
      };

      sendMessage('/pub/friend/request', payload);

      console.log(`${nickname}에게 친구 요청 전송`);
      alert('친구 요청을 보냈습니다.');
    } catch (error) {
      console.error('친구 신청 실패:', error);
      alert('친구 요청 전송에 실패했습니다.');
    } finally {
      setIsRequesting(false);
    }
  };

  // 게임초대
  const handleInvite = () => {
    if (!isInviting) {
      // 초대 요청 전송
      const payload = {
        inviteeId: friendId, // 초대할 친구의 ID
        roomId: 3, // 예시로 방 ID를 3으로 설정 (여기서는 방 ID를 동적으로 처리할 수 있으면 좋겠어요)
      };

      sendMessage('/pub/team/invite', payload); // 서버로 게임 초대 요청 보내기
      console.log(`${nickname} 게임 초대 요청 전송`, payload);
    }

    setIsInviting(prev => !prev); // 초대 상태 변경
  };

  // 친구 삭제
  const handleDeleteFriend = async () => {
    try {
      const payload = { userId, friendId };
      sendMessage('/pub/friend/delete', payload); // socketStore의 sendMessage 사용
      console.log('친구 삭제 요청 전송', payload);
      onDeleteFriend(friendId); // 삭제 후 부모에게 알림
    } catch (error) {
      console.error('친구 삭제 실패:', error);
    }
  };

  // // 채팅으로 이동
  // const handleChat = async () => {
  //   try {
  //     const response = await getChatRoomDetail(friendId);
  //     console.log('채팅방 데이터:', response.data);

  //     // 채팅 모달 열기 등의 로직
  //     onChat?.(friendId);
  //   } catch (error: any) {
  //     console.error('채팅방 조회 실패:', error);

  //     // 에러 처리 로직 추가
  //     if (error.response) {
  //       // 서버에서 응답 받았지만 오류 상태
  //       alert(error.response.data.message || '채팅방을 불러올 수 없습니다.');
  //     } else if (error.request) {
  //       // 요청은 보냈지만 응답 받지 못함
  //       alert('서버 응답이 없습니다. 네트워크 연결을 확인해주세요.');
  //     } else {
  //       // 요청 설정 중 오류 발생
  //       alert('요청 중 오류가 발생했습니다.');
  //     }
  //   }
  // };

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
