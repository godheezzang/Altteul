import React, { useEffect } from 'react';
import FriendModal from '@components/Friend/FriendModal';
import FriendListItem from '@components/Friend/FriendListItem';

import { useUserSearch } from 'Contexts/UserSearchContext';
import { useFriendWebSocket } from 'Hooks/useFriendWebSocket';

import { useSocketStore } from '@stores/socketStore';

type UserSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UserSearchModal = ({ isOpen, onClose }: UserSearchModalProps) => {
  const { searchResults } = useUserSearch();

  return (
    <FriendModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-primary-white mb-4">친구 추가</h2>
        {searchResults.length > 0 ? (
          searchResults.map(user => (
            <FriendListItem
              key={user.userId}
              friendId={user.userId}
              nickname={user.nickname}
              profileImg={user.profileImage}
              isOnline={false}
              // 친구가 아닌 경우에만 버튼 표시
              showFriendRequest={!user.isFriend}
            />
          ))
        ) : (
          <div className="text-center text-gray-03 p-4">검색 결과가 없습니다.</div>
        )}
      </div>
    </FriendModal>
  );
};

export default UserSearchModal;
