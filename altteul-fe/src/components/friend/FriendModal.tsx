// components/friend/FriendModal.tsx
import React, { useState, ReactNode } from 'react';
import BaseModal from '@components/friend/friend_common/Basemodal';
import SearchBar from '@components/common/SearchBar';
import Navigation from '@components/friend/friend_common/Navigation';
import FriendListContent from '@components/friend/FriendListContent';
import ChatListContent from '@components/friend/chat/ChatListContent';
import NotificationAndRequestModal from '@components/friend/NotificationAndRequestModal';

type FriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onChatSelect?: (friendId: number) => void;
  children?: ReactNode;
  showSearch?: boolean;
};

type TabType = 'friends' | 'chat' | 'notifications';

const FriendModal = ({
  isOpen,
  onClose,
  onChatSelect,
  children,
  showSearch = true,
}: FriendModalProps) => {
  const [currentTab, setCurrentTab] = useState<TabType>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  const getSearchPlaceholder = () => {
    switch (currentTab) {
      case 'friends':
        return '친구 닉네임으로 검색';
      case 'chat':
        return '채팅방 검색';
      default:
        return '';
    }
  };

  // 탭에 따른 검색바 표시 여부
  const showSearchBar = showSearch && (currentTab === 'friends' || currentTab === 'chat');

  // 채팅창에서는 네브바를 숨김
  const showNavigation = !children;

  // 탭에 따른 컨텐츠 렌더링
  const renderContent = () => {
    if (children) {
      return children;
    }

    switch (currentTab) {
      case 'friends':
        return <FriendListContent searchQuery={searchQuery} />;
      case 'chat':
        return <ChatListContent searchQuery={searchQuery} onChatSelect={onChatSelect} />;
      case 'notifications':
        return <NotificationAndRequestModal isOpen={true} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {/* 검색창 - 친구와 채팅 탭에서만 표시 */}
      {showSearchBar && (
        <div className="relative mt-10">
          <SearchBar
            placeholder={getSearchPlaceholder()}
            initiaValue={searchQuery}
            onSearch={searchTerm => {
              setSearchQuery(searchTerm);
            }} // 검색 로직 추가 필요시
            className="mt-2"
          />
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>

      {/* children이 있을 때는 네비게이션 바를 숨김 */}
      {showNavigation && (
        <Navigation
          currentTab={currentTab}
          onNavigate={tab => {
            setCurrentTab(tab);
            setSearchQuery('');
          }}
        />
      )}
    </BaseModal>
  );
};

export default FriendModal;
