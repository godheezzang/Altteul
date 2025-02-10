import React, { useState } from "react";
import FriendInput from "@components/friend/FriendInput";

type FriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void; // 검색 시 호출할 함수
  showNavigation?: boolean;
  onNavigate?: (tab: "friends" | "chat" | "notifications") => void;
};

const FriendModal = ({
  isOpen,
  onClose,
  children,
  showSearch = true,
  onSearch,
  showNavigation = false,
  onNavigate,
}: FriendModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-primary-black bg-opacity-50">
      <div className="bg-[#FFEBE0] border-2 border-orange-500 rounded-lg w-[90vw] max-w-md h-[90vh] max-h-[80vh] p-4 shadow-lg relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-orange-500 font-bold"
        >
          닫기
        </button>

        {/* 검색창 */}
        {showSearch && (
          <div className="relative mt-10">
            <FriendInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색하는 곳"
              onSearch={handleSearchClick}
            />
          </div>
        )}

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* 하단 네비게이션 버튼들 (showNavigation이 true일 때만 표시) */}
        {showNavigation && (
          <div className="mt-4 flex justify-around border-t border-orange-300 pt-3">
            <button
              onClick={() => onNavigate?.("friends")}
              className="flex flex-col items-center px-4 py-2 text-orange-500 hover:bg-orange-100 rounded-lg"
            >
              <span className="text-lg">👥</span>
              <span className="text-sm">친구목록</span>
            </button>

            <button
              onClick={() => onNavigate?.("chat")}
              className="flex flex-col items-center px-4 py-2 text-orange-500 hover:bg-orange-100 rounded-lg"
            >
              <span className="text-lg">💬</span>
              <span className="text-sm">채팅목록</span>
            </button>

            <button
              onClick={() => onNavigate?.("notifications")}
              className="flex flex-col items-center px-4 py-2 text-orange-500 hover:bg-orange-100 rounded-lg"
            >
              <span className="text-lg">🔔</span>
              <span className="text-sm">알림목록</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendModal;
