// 친구 추가 모달

import React from "react";
import FriendModal from "./FriendModal";

type FriendAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FriendAddModal = ({ isOpen, onClose }: FriendAddModalProps) => {
  return (
    <FriendModal isOpen={isOpen} onClose={onClose}>
      <h2>친구 추가</h2>
      <div className="friend-add">
        <img src="profile.jpg" alt="친구 프로필" className="add-img" />
        <div className="add-info">
          <p>친구 이름</p>
        </div>
        <button>친구 추가</button>
      </div>
    </FriendModal>
  );
};

export default FriendAddModal;
