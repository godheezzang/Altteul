// 메인 모달 컴포넌트
// src/components/Modal/Chat/ChatModal.tsx
import { useEffect, useState } from 'react';
import BaseModal from '@components/Friend/friend_common/Basemodal';
import Navigation from '@components/ChatModal/Shared/Navigation';
import MainView from '@components/ChatModal/Views/MainView.tsx';
import ChatView from '@components/ChatModal/Views/ChatView';
import SearchBar from '@components/ChatModal/Shared/SearchBar';

type MainTabType = 'friends' | 'chats' | 'notifications';
type NotificationTabType = 'friendRequests' | 'gameInvites';
type ViewType = 'main' | 'chat';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  // 모달의 핵심 상태들
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [currentTab, setCurrentTab] = useState<MainTabType>('friends');
  const [notificationTab, setNotificationTab] = useState<NotificationTabType>('friendRequests');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('main');
      setCurrentTab('friends');
      setNotificationTab('friendRequests');
      setSearchQuery('');
      setActiveChatId(null);
    }
  }, [isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      showBackButton={currentView === 'chat'}
      onBack={() => setCurrentView('main')}
    >
      <div className="flex flex-col h-full">
        {/* Header: 검색바 (친구/채팅 탭에서만 표시) */}
        {currentView === 'main' && (currentTab === 'friends' || currentTab === 'chats') && (
          <div className="p-4">
            {/* <SearchBar
              onSearchResult={result => {
                // API 결과를 받은 후 필요한 작업을 수행
                console.log('검색 결과:', result);
              }}
              placeholder={currentTab === 'friends' ? '유저를 검색하세요.' : '채팅방을 검색하세요.'}
            /> */}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'main' ? (
            <MainView
              currentTab={currentTab}
              searchQuery={searchQuery}
              onStartChat={(friendId: number) => {
                setActiveChatId(friendId);
                setCurrentView('chat');
              }}
            />
          ) : (
            <ChatView friendId={activeChatId!} onBack={() => setCurrentView('main')} />
          )}
        </div>

        {/* Footer: Navigation (메인 뷰에서만 표시) */}
        {currentView === 'main' && (
          <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
        )}
      </div>
    </BaseModal>
  );
};

export default ChatModal;
