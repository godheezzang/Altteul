/// 친구/채팅/알림 탭을 포함하는 메인 뷰
// src/components/Modal/Chat/views/MainView.tsx
import FriendTab from '@components/Modal/FriendChat/Tabs/FriendTab';

interface MainViewProps {
  currentTab: 'friends' | 'chats' | 'notifications';
  searchQuery: string;
  onStartChat: (friendId: number) => void;
}

const MainView = ({ currentTab, searchQuery, onStartChat }: MainViewProps) => {
  const renderTabContent = () => {
    switch (currentTab) {
      case 'friends':
        return <FriendTab searchQuery={searchQuery} onStartChat={onStartChat} />;
      case 'chats':
        return <div>Chat Tab</div>; // 임시
      case 'notifications':
        return <div>Notification Tab</div>; // 임시
      default:
        return null;
    }
  };

  return <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>;
};

export default MainView;
