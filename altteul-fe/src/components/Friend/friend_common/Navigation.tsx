// components/friend/Navigation.tsx
import Friend_list from '@assets/icon/friend/Friend_list.svg';
import Chat_bubble from '@assets/icon/friend/Chat_bubble.svg';
import Notifications from '@assets/icon/friend/Notifications.svg';

type NavigationProps = {
  currentTab: 'friends' | 'chat' | 'notifications';
  onNavigate: (tab: 'friends' | 'chat' | 'notifications') => void;
};

const Navigation = ({ currentTab, onNavigate }: NavigationProps) => {
  return (
    <div className="mt-4 flex justify-around border-t border-orange-300 pt-3">
      <button
        onClick={() => onNavigate('friends')}
        className={`relative flex flex-col items-center p-1 hover:scale-110 rounded-lg ${
          currentTab === 'friends' ? 'text-primary-orange' : 'text-gray-02'
        }`}
      >
        <img src={Friend_list} alt="친구목록" className="w-10 h-10" />
      </button>

      <button
        onClick={() => onNavigate('chat')}
        className={`relative flex flex-col items-center px-4 py-2 hover:scale-110 rounded-lg ${
          currentTab === 'chat' ? 'text-primary-orange' : 'text-gray-02'
        }`}
      >
        <img src={Chat_bubble} alt="채팅목록" className="w-9 h-9" />
      </button>

      <button
        onClick={() => onNavigate('notifications')}
        className={`relative flex flex-col items-center px-4 py-2 hover:scale-110 rounded-lg ${
          currentTab === 'notifications' ? 'text-primary-orange' : 'text-gray-02'
        }`}
      >
        <img src={Notifications} alt="알림목록" className="w-9 h-9" />
      </button>
    </div>
  );
};

export default Navigation;
