// 채팅 모달 임시

// pages/MainPage.tsx
import React, { useState } from 'react';
import FriendModal from '@components/friend/FriendModal';
import FriendChatModal from '@components/friend/FriendChatModal';

const MainPage = () => {
  // 통합 모달과 채팅 모달만 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);

  const handleOpenChat = (friendId: number) => {
    setSelectedFriendId(friendId);
    setIsModalOpen(false); // 메인 모달 닫기
    setIsChatOpen(true); // 채팅 모달 열기
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 하나의 버튼만 유지 */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-3 bg-primary-orange rounded-full hover:opacity-80"
        >
          <img src="/src/assets/icon/Friend_list.svg" alt="친구 목록" className="w-6 h-6" />
        </button>
      </div>

      {/* 통합된 메인 모달 */}
      <FriendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChatSelect={handleOpenChat}
      />

      {/* 채팅 모달은 별도 유지 */}
      <FriendChatModal
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedFriendId(null);
        }}
        friendId={selectedFriendId || 1}
      />
    </div>
  );
};

export default MainPage;
