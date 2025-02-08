import React, { useState } from "react";
import FriendInput from "@components/friend/FriendInput";

type FriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void; // 검색 시 호출할 함수
};

const FriendModal = ({
  isOpen,
  onClose,
  children,
  showSearch = true,
  onSearch,
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
      <div className="bg-[#FFEBE0] border-2 border-orange-500 rounded-lg w-[90vw] max-w-md h-[90vh] max-h-[80vh] p-4 shadow-lg relative">
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
              onChange={(e) => setSearchQuery(e.target.value)} // 검색어 업데이트
              placeholder="검색하는 곳"
              onSearch={handleSearchClick} // 검색 버튼 클릭 시 동작
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default FriendModal;
