import React from "react";
import FriendInput from "@components/friend/FriendInput";
import { useUserSearch } from "contexts/UserSearchContext";

type FriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showSearch?: boolean;
  showNavigation?: boolean;
  onNavigate?: (tab: "friends" | "chat" | "notifications") => void;
  unreadChats?: number;
  pendingFriends?: number;
  notifications?: number;
};

const FriendModal = ({
  isOpen,
  onClose,
  children,
  showSearch = true,
  showNavigation = false,
  onNavigate,

}: FriendModalProps) => {

  const { searchQuery, handleSearch, searchResults } = useUserSearch();

  const handleOnSearch = () => {
    handleSearch(searchQuery)
  }

  if (!isOpen) return null;

 

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-primary-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-06 border-2 border-primary-orange rounded-lg w-[90vw] max-w-md h-[90vh] max-h-[80vh] p-4 shadow-lg relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-primary-orange hover:opacity-80"
        >
          <img
            src="/src/assets/icon/exit_line.svg"
            alt="닫기"
            className="w-6 h-6"
          />
        </button>

        {/* 검색창 */}
        {showSearch && (
          <div className="relative mt-10">
            <FriendInput
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleOnSearch}
              placeholder="닉네임을 입력하세요."
            />

            {/* 검색결과 */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-06 border border-primary-orange rounded-md max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.friendId}
                    className="p-2 hover:bg-gray-04 cursor-pointer text-primary-white"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={user.profileImg}
                        alt="프로필"
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{user.nickname}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* 하단 네비게이션 버튼들 (showNavigation이 true일 때만 표시) */}
        {showNavigation && (
          <div className="mt-4 flex justify-around border-t border-orange-300 pt-3">
            <button
              onClick={() => onNavigate?.("friends")}
              className="relative flex flex-col items-center p-1 hover:scale-110 rounded-lg"
            >
              <img
                src="/src/assets/icon/Friend_list.svg"
                alt="친구목록"
                className="w-10 h-10"
              />
            </button>

            <button
              onClick={() => onNavigate?.("chat")}
              className="relative flex flex-col items-center px-4 py-2 hover:scale-110 rounded-lg"
            >
              <img
                src="/src/assets/icon/Chat_bubble.svg"
                alt="채팅목록"
                className="w-9 h-9"
              />
            </button>

            <button
              onClick={() => onNavigate?.("notifications")}
              className="relative flex flex-col items-center px-4 py-2 hover:scale-110 rounded-lg"
            >
              <img
                src="/src/assets/icon/Notifications.svg"
                alt="알림목록"
                className="w-9 h-9"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendModal;
