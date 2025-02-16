// 친구 목록 아이템
// src/components/Modal/Chat/items/FriendItem.tsx

import { useSocketStore } from '@stores/socketStore';
import useAuthStore from '@stores/authStore';

interface FriendItemProps {
  friend: {
    userid: number;
    nickname: string;
    profileImg: string;
    isOnline: boolean;
  };
  onRefresh: () => void;
  onStartChat: (friendId: number) => void;
}

const FriendItem = ({ friend, onRefresh, onStartChat }: FriendItemProps) => {
  const { sendMessage } = useSocketStore();
  const { userId } = useAuthStore();

  // 게임 초대
  const handleGameInvite = () => {
    const payload = {
      inviteeId: friend.userid,
      roomId: 3, // 임시 룸 ID
    };

    sendMessage('/pub/team/invite', payload);
    console.log(`${friend.nickname} 게임 초대 요청 전송`, payload);
  };

  // 친구 삭제
  const handleDeleteFriend = async () => {
    try {
      const payload = { userId, friendId: friend.userid };
      sendMessage('/pub/friend/delete', payload);
      console.log('친구 삭제 요청 전송', payload);
      onRefresh(); // 친구 목록 새로고침
    } catch (error) {
      console.error('친구 삭제 실패:', error);
    }
  };

  const handleChat = () => {
    console.log('111111111111111111', friend.userid);
    onStartChat(friend.userid);
  };

  return (
    <div className="flex items-center justify-between bg-gray-04 p-3 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={friend.profileImg} alt="프로필" className="w-10 h-10 rounded-full" />
          <div
            className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 ${
              friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <p className="font-semibold text-primary-white">{friend.nickname}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleGameInvite}
          className="px-3 py-1 bg-primary-orange text-white rounded hover:bg-primary-orange/80"
        >
          게임 초대
        </button>
        <button
          onClick={handleChat}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-500/80"
        >
          대화하기
        </button>
        <button
          onClick={handleDeleteFriend}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-500/80"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default FriendItem;
