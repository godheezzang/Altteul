// src/components/Modal/FriendChat/Items/FriendRequestItem.tsx
import useAuthStore from '@stores/authStore';
import { useSocketStore } from '@stores/socketStore';
import { friendRequestResponse } from '@utils/Api/friendChatApi';
import { FriendRequest } from 'types/types';
import requestAccept from '@assets/icon/friend/requestAccept.svg'
import requestReject from '@assets/icon/friend/requestReject.svg'

interface FriendRequestItemProps {
  request: FriendRequest;
  onRefresh: (friendRequestId:number) => void;
}

const FriendRequestItem = ({ request, onRefresh }: FriendRequestItemProps) => {
  const { sendMessage } = useSocketStore();
  const currentUserId = useAuthStore().userId;

  const handleResponse = (yn: "P" | "A" | "R") => {
    const response = {
      friendRequestId: request.friendRequestId,
      fromUserId: request.fromUserId, // 요청 보낸 사람 id
      toUserId: Number(currentUserId), // 요청 받은 사람 id
      requestStatus: yn,
    };
    friendRequestResponse(response);
    sendMessage('/pub/friend/request/process', response);
    onRefresh(request.friendRequestId);
  };

  return (
    <div className="flex items-center justify-between bg-gray-04 p-3 rounded-lg">
      <div className="flex items-center gap-3">
        <img src={request.fromUserProfileImg} alt="프로필" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold text-primary-white">{request.fromUserNickname}</p>
          <p className="text-sm text-gray-400">친구 요청을 보냈습니다</p>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={() => handleResponse('A')}
          className="px-2 py-1 "
        >
          <img src={requestAccept} alt="수락" className='w-8 h-8' />
        </button>
        <button
          onClick={() => handleResponse('R')}
          className="px-2 py-1 "
        >
          <img src={requestReject} alt="거절" className='w-8 h-8' />
        </button>
      </div>
    </div>
  );
};

export default FriendRequestItem;
