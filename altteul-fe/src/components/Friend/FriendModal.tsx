import React, { useState, ReactNode, useEffect } from 'react';

import BaseModal from '@components/Friend/friend_common/Basemodal';
import SearchBar from '@components/Common/SearchBar';
import Navigation from '@components/Friend/friend_common/Navigation';
import FriendListContent from '@components/Friend/FriendListContent';
import ChatListContent from '@components/Friend/chat/ChatListContent';
import NotificationAndRequestModal from '@components/Friend/NotificationAndRequestModal';
import FriendChatModal from '@components/Friend/FriendChatModal';

type FriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  showSearch?: boolean;
};

type TabType = 'friends' | 'chat' | 'notifications';

const FriendModal = ({ isOpen, onClose, children, showSearch = true }: FriendModalProps) => {
  const [currentTab, setCurrentTab] = useState<TabType>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [openChatroom, setOpenChatroom] = useState<number | null>(null);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setCurrentTab('friends');
      setSearchQuery('');
      setOpenChatroom(null);
    }
  }, [isOpen]);

  // 탭에 따른 검색바 표시 여부
  const showSearchBar = showSearch && (currentTab === 'friends' || currentTab === 'chat');

  // 탭에 따라 검색창의 Placeholder를 다르게
  const searchPlaceholder = () => {
    switch (currentTab) {
      case 'friends':
        return '유저를 검색하세요.';
      case 'chat':
        return '채팅방을 검색하세요.';
      default:
        return '';
    }
  };

  // 채팅창이 열려있을때는 하단 네브바를 숨김
  const showNavigation = !openChatroom;

  // 탭에 따른 컨텐츠 렌더링
  const renderContent = () => {
    if (children) {
      return children;
    }

    switch (currentTab) {
      case 'friends':
        return <FriendListContent searchQuery={searchQuery} />;
      case 'chat':
        return (
          <ChatListContent
            searchQuery={searchQuery}
            onChatSelect={friendId => setOpenChatroom(friendId)}
          />
        );
      case 'notifications':
        return <NotificationAndRequestModal isOpen={true} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {
        onClose(); // 부모 컴포넌트에서 정의된 onClose도 호출
        setOpenChatroom(null); // 모달 닫을 때 채팅 선택 초기화
      }}
      showBackButton={!!openChatroom}
      onBack={() => {
        console.log('뒤로가기 버튼 클릭');
        setOpenChatroom(null);
        setCurrentTab('chat');
      }}
    >
      {/* 검색창 - 친구와 채팅 탭에서만 표시 */}
      {showSearchBar && (
        <div className="relative mt-10">
          <SearchBar
            placeholder={searchPlaceholder()}
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
