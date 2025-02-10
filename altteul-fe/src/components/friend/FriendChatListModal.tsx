import React from "react";
import FriendModal from "./FriendModal";
import { mockChatRooms } from "mocks/friendData";

type FriendChatListModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FriendChatListModal = ({ isOpen, onClose }: FriendChatListModalProps) => {
  return (
    <FriendModal isOpen={isOpen} onClose={onClose} showNavigation={true}>
      <div className="chat-list space-y-4">
        {mockChatRooms.map((chat) => (
          <div
            key={chat.friendId}
            className="flex items-center gap-3 p-2 border-b"
          >
            {/* 프로필 이미지 */}
            <div className="relative">
              <img
                src={chat.profileImg} // 실제 이미지 URL 적용 필요
                alt={`${chat.nickname} 프로필`}
                className="w-12 h-12 rounded-full"
              />
              {/* 온라인 상태 표시 */}
              {chat.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
              )}
            </div>

            {/* 닉네임 & 최근 메시지 */}
            <div className="flex-1">
              <p className="font-medium text-primary-black">{chat.nickname}</p>
              <p
                className={`text-sm ${
                  chat.isMessageRead ? "text-gray-03" : "text-primary-orange"
                }`}
              >
                {chat.recentMessage}
              </p>
            </div>

            {/* 최근 메시지 시간 */}
            <p className="text-xs text-gray-400">
              {new Date(chat.createdAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
      </div>
    </FriendModal>
  );
};

export default FriendChatListModal;
