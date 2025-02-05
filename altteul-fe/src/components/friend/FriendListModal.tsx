// 친구 목록 모달
import React from "react";
import FriendModal from "@components/friend/FriendModal";
import FriendInput from "@components/friend/FriendInput";

type FriendListModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FriendListModal = ({ isOpen, onClose }: FriendListModalProps) => {
  return (
    <FriendModal isOpen={isOpen} onClose={onClose}>
      <h2>친구목록</h2>
      <FriendInput value="" onChange={() => {}} placeholder="친구검색" />
      <div className="friend-list">
        <div className="friend-item">
          <img src="profile.jpg" alt="친구 프로필" className="friend-img" />
          <div className="friend-info">
            <p>친구 이름</p>
            <p>대기 중</p>
          </div>
          <button>게임 초대</button>
          <button>차단</button>
        </div>
        {/* 여러 친구 아이템을 여기에 추가 */}
      </div>
    </FriendModal>
  );
};

export default FriendListModal;
