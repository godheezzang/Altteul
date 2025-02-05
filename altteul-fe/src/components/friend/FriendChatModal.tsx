// 채팅창 모달

// FriendChatModal.tsx
import React, { useState } from "react";
import FriendModal from "./FriendModal";

type FriendChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FriendChatModal = ({ isOpen, onClose }: FriendChatModalProps) => {
  const [message, setMessage] = useState("");

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    // 메시지 전송 로직
    console.log(message);
    setMessage("");
  };

  return (
    <FriendModal isOpen={isOpen} onClose={onClose}>
      <h2>채팅</h2>
      <div className="chat-box">
        {/* 메시지 말풍선 내용 */}
        <div className="message-bubble">메시지 내용</div>
      </div>
      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={handleSendMessage}>전송</button>
    </FriendModal>
  );
};

export default FriendChatModal;
