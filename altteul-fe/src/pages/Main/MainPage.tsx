import AnimatedCodeEditor from '@components/Main/AnimatedCodeEditor';
import useAuthStore from '@stores/authStore';
import { useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
// import GameGuide from '@components/Main/GameGuide';
import SmallButton from '@components/Common/Button/SmallButton ';
import { useNavigate } from 'react-router-dom';
import LoginModal from '@components/Auth/LoginModal';
import useModalStore from '@stores/modalStore';

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
