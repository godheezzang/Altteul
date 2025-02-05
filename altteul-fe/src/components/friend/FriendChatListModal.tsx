// 채팅 목록 모달

import React from "react";
import FriendModal from "./FriendModal";

type FriendChatListModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FriendChatListModal = ({ isOpen, onClose }: FriendChatListModalProps) => {
  return (
    <FriendModal isOpen={isOpen} onClose={onClose}>
      <h2>채팅 목록</h2>
      <div className="chat-list">
        <div className="chat-item">
          <img src="profile.jpg" alt="친구 프로필" className="chat-img" />
          <div className="chat-info">
            <p>친구 이름</p>
            <p>마지막 대화 내용</p>
          </div>
        </div>
        {/* 여러 채팅 아이템을 여기에 추가 */}
      </div>
    </FriendModal>
  );
};

export default FriendChatListModal;
