import React, { useState } from "react";
import FriendModal from "./FriendModal";
import { mockChatWithFriend } from "mocks/friendData";

type FriendChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  friendId?: number;
};

const FriendChatModal = ({
  isOpen,
  onClose,
  friendId = 1,
}: FriendChatModalProps) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(mockChatWithFriend.messages);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        chatMessageId: Date.now(),
        senderId: 0,
        senderNickname: "나",
        messageContent: message,
        checked: false,
        createdAt: new Date().toISOString(),
      };
      setChatHistory((prevHistory) => [...prevHistory, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <FriendModal isOpen={isOpen} onClose={onClose} showSearch={false}>
      <div className="flex flex-col h-full ">
        {/* 채팅방 헤더 */}
        <div className="border-b border-primary-orange p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={mockChatWithFriend.profileImg}
                alt="프로필"
                className="w-10 h-10 rounded-full"
              />
              <div
                className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2  ${
                  mockChatWithFriend.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            <span className="font-semibold text-lg text-primary-black">
              {mockChatWithFriend.nickname}
            </span>
          </div>
        </div>

        {/* 채팅 메시지 영역 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-orange scrollbar-track-primary-white hover:scrollbar-thumb-primary-orange/80">
          <div className="p-4 space-y-4">
            {chatHistory.map((msg) => (
              <div
                key={msg.chatMessageId}
                className={`flex ${
                  msg.senderId === 0 ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.senderId === 0
                      ? "bg-primary-orange text-white"
                      : "bg-primary-white text-primary-black"
                  }`}
                >
                  <p className="mb-1">{msg.messageContent}</p>
                  <div className="text-xs text-right opacity-80">
                    {new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 메시지 입력 영역 */}
        <div className="border-t border-primary-orange p-4 ">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              placeholder="채팅을 입력하세요."
              className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-01 focus:outline-none focus:border-primary-orange text-primary-black"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
            >
              <img
                src="src/assets/icon/Send.svg"
                alt="send message"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>
    </FriendModal>
  );
};

export default FriendChatModal;
