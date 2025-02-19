// 친구 목록 아이템
// src/components/Modal/Chat/items/FriendItem.tsx

import { useSocketStore } from '@stores/socketStore';
import useAuthStore from '@stores/authStore';
import useFriendChatStore from '@stores/friendChatStore';
import { deleteFriend, inviteFriend } from '@utils/Api/friendChatApi';
import startChat from '@assets/icon/friend/startChat.svg';
import deleteUser from '@assets/icon/friend/deleteUser.svg';
import inviteFriendIcon from '@assets/icon/friend/inviteFriend.svg';

interface FriendItemProps {
  friend: {
    userid: number;
    nickname: string;
    profileImg: string;
    isOnline: boolean;
  };
  onRefresh?: (friendId: number) => void;
}

const FriendItem = ({ friend, onRefresh }: FriendItemProps) => {
  const { sendMessage } = useSocketStore();
  const fcStore = useFriendChatStore();
  const userId = useAuthStore().userId;
  const roomId = JSON.parse(sessionStorage.getItem('matchData'))?.roomId || null;

  // 게임 초대
  const handleGameInvite = () => {
    const payload = {
      inviteeId: friend.userid,
      roomId: roomId,
    };
    inviteFriend(payload);
  };

  // 친구 삭제
  const handleDeleteFriend = async () => {
    try {
      const payload = { userId: userId, friendId: friend.userid };
      deleteFriend(Number(userId), friend.userid);
      sendMessage('/pub/friend/delete', payload);
      console.log('친구 삭제 요청 전송', payload);
      onRefresh(friend.userid); // 친구 목록 새로고침(해당 요소 제거)
    } catch (error) {
      console.error('친구 삭제 실패:', error);
    }
  };

  const handleChat = async () => {
    fcStore.setActiveChatId(friend.userid);
    fcStore.setCurrentView('chat');
  };

  const showInviteButton = ['/match/team/composition'].includes(location.pathname);

  return (
    <div className="flex items-center justify-between bg-gray-04 p-3 rounded-lg">
      {/* <div className="flex items-center justify-between border border-gray-500 p-3 rounded-lg"> */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={friend.profileImg} alt="프로필" className="ml-2 w-10 h-10 rounded-full" />
          <div
            className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 ${
              friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <p className="font-semibold text-primary-white">{friend.nickname}</p>
      </div>
      |
      <div className="flex gap-2">
        {showInviteButton && (
          <button onClick={handleGameInvite} className="px-3 py-1 ">
            <img src={inviteFriendIcon} alt="초대" className="w-8 h-8" />
          </button>
        )}
        <button onClick={handleChat} className="px-0.5 py-1 rounded ">
          <img src={startChat} alt="채팅" className="w-6 h-6" />
        </button>
        <button onClick={handleDeleteFriend} className="px-2 py-1">
          <img src={deleteUser} alt="차단" className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default FriendItem;
