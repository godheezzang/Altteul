// src/components/Modal/FriendChat/Items/FriendRequestItem.tsx
import useAuthStore from '@stores/authStore';
import { useSocketStore } from '@stores/socketStore';

export interface FriendRequest {
  friendRequestId: number;
  fromUserId: number;
  fromUserNickname: string;
  fromUserProfileImg: string;
  requestStatus: string;
}

interface FriendRequestItemProps {
  request: FriendRequest;
  onRefresh: () => void;
}

const FriendRequestItem = ({ request, onRefresh }: FriendRequestItemProps) => {
  const { sendMessage } = useSocketStore();
  const currentUserId = useAuthStore().userId

  const handleAccept = () => {
    sendMessage('/pub/friend/request/process', {
      friendRequestId : request.friendRequestId,
      fromUserId: request.fromUserId, // 요청 보낸 사람 id
      toUserId: currentUserId, // 요청 받은 사람 id
      requestStatus : "A"
    });
    onRefresh();
  };

  const handleReject = () => {
    sendMessage('/pub/friend/request/process', {
      friendRequestId : request.friendRequestId,
      fromUserId: request.fromUserId, // 요청 보낸 사람 id
      toUserId: useAuthStore().userId, // 요청 받은 사람 id
      requestStatus : "R"
    });
    onRefresh();
  };

  return (
    <div className="flex items-center justify-between bg-gray-04 p-3 rounded-lg hover:bg-gray-03 transition-colors">
      <div className="flex items-center gap-3">
        <img src={request.fromUserProfileImg} alt="프로필" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold text-primary-white">{request.fromUserNickname}</p>
          <p className="text-sm text-gray-400">친구 요청을 보냈습니다</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="px-3 py-1 bg-primary-orange text-white rounded hover:bg-primary-orange/80"
        >
          수락
        </button>
        <button
          onClick={handleReject}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-500/80"
        >
          거절
        </button>
      </div>
    </div>
  );
};

export default FriendRequestItem;