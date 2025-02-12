// components/friend/UserSearchModal.tsx
import React from "react";

import FriendModal from "@components/friend/FriendModal";
import FriendListItem from "@components/friend/FriendListItem";
import { useUserSearch } from "contexts/UserSearchContext";
import { User } from "mocks/searchUserData";


type UserSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UserSearchModal = ({ isOpen, onClose }: UserSearchModalProps) => {
  const { searchResults } = useUserSearch();

  return (
    <FriendModal isOpen={isOpen} onClose={onClose}>
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <FriendListItem
              key={user.friendId}
              user = {user}
              onAddFriend={() => {}}
              isInviting={false}
            />
          ))
        ) : (
          <div className="text-center p-4">검색 결과가 없습니다.</div>
        )}
    </FriendModal>
  );
};

export default UserSearchModal;