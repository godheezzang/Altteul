// components/friend/Navigation.tsx
type NavigationProps = {
  currentTab: "friends" | "chat" | "notifications";
  onNavigate: (tab: "friends" | "chat" | "notifications") => void;
};

const Navigation = ({ currentTab, onNavigate }: NavigationProps) => {
  return (
    <div className="mt-4 flex justify-around border-t border-orange-300 pt-3">
      <button
        onClick={() => onNavigate("friends")}
        className={`relative flex flex-col items-center p-1 hover:scale-110 rounded-lg ${
          currentTab === "friends" ? "text-primary-orange" : "text-gray-02"
        }`}
      >
        <img
          src="/src/assets/icon/Friend_list.svg"
          alt="친구목록"
          className="w-10 h-10"
        />
      </button>

      <button
        onClick={() => onNavigate("chat")}
        className={`relative flex flex-col items-center px-4 py-2 hover:scale-110 rounded-lg ${
          currentTab === "chat" ? "text-primary-orange" : "text-gray-02"
        }`}
      >
        <img
          src="/src/assets/icon/Chat_bubble.svg"
          alt="채팅목록"
          className="w-9 h-9"
        />
      </button>

      <button
        onClick={() => onNavigate("notifications")}
        className={`relative flex flex-col items-center px-4 py-2 hover:scale-110 rounded-lg ${
          currentTab === "notifications" ? "text-primary-orange" : "text-gray-02"
        }`}
      >
        <img
          src="/src/assets/icon/Notifications.svg"
          alt="알림목록"
          className="w-9 h-9"
        />
      </button>
    </div>
  );
};

export default Navigation;