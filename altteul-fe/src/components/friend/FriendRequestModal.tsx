// 받은 친구 신청 모달
import React from "react";
import FriendModal from "./FriendModal";

type FriendRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FriendRequestModal = ({ isOpen, onClose }: FriendRequestModalProps) => {
  return (
    <FriendModal isOpen={isOpen} onClose={onClose}>
      <h2>친구 신청</h2>
      <div className="friend-request">
        <img src="profile.jpg" alt="유저 프로필" className="request-img" />
        <div className="request-info">
          <p>친구 신청한 유저</p>
        </div>
        <button>수락</button>
        <button>거절</button>
      </div>
    </FriendModal>
  );
};

export default FriendRequestModal;
