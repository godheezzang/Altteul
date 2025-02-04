import React, { useState } from "react";
import "@components/common/modal/FriendModal/ChatModal.css";

import Modal from "@components/common/modal/Modal";

type ChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  if (!isOpen) return null; // 모달 닫혀있으면 렌더링x

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, input]);
      setInput(""); // 입력창을 초기화함
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="채팅">
      <div className="chat-modal">
        <div className="chat-header">
          <button className="back-btn">뒤로가기</button>
          {/* <img className="profile-img" /> 여기수정 */}
          <div className="profile-info">
            <span className="nickname">친구 닉네임</span>
            <span className="status=circle onlone"></span>
          </div>
        </div>

        {/* 채팅메시지 */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-bubble">
              <span className="chat-nickname">친구 닉네임</span>
              <p>{msg}</p>
            </div>
          ))}
        </div>

        {/* 입력창 & 전송버튼 */}
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
          />
          <button className="send-btn" onClick={sendMessage}>
            전송
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
