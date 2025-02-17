// src/stores/friendChatStore.ts
import { FriendRequest } from 'types/types';
import { getState } from 'yjs';
import { create } from 'zustand';

type ViewType = 'main' | 'search' | 'chat';
type MainTabType = 'friends' | 'chats' | 'notifications';
type NotificationTabType = 'friendRequests' | 'gameInvites';

interface FriendChatState {
  // 기존 상태들
  currentView: ViewType;
  currentTab: MainTabType;
  notificationTab: NotificationTabType;
  searchQuery: string;
  activeChatId: number;

  // 검색 관련 상태 추가
  isSearching: boolean;
  searchError: string;
  hasMore: boolean;  // 무한 스크롤을 위한 상태

  //친구신청목록
  // friendRequests: FriendRequest[]

  
  // 액션들
  setCurrentView: (view: ViewType) => void;
  setCurrentTab: (tab: MainTabType) => void;
  setNotificationTab: (tab: NotificationTabType) => void;
  setSearchQuery: (query: string) => void;
  setActiveChatId: (chatId: number | null) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSearchError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  // setFriendRequests: (friendRequests: FriendRequest) => void
  
  startChat: (friendId: number) => void;
  resetStore: () => void;
}

const initialState = {
  currentView: 'main' as ViewType,
  currentTab: 'friends' as MainTabType,
  notificationTab: 'friendRequests' as NotificationTabType,
  searchQuery: '',
  activeChatId: 0,
  isSearching: false,
  searchError: "",
  hasMore: true,
};

const useFriendChatStore = create<FriendChatState>((set) => ({
  ...initialState,

  setCurrentView: (view) => set({ currentView: view }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setNotificationTab: (tab) => set({ notificationTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setSearchError: (error) => set({ searchError: error }),
  setHasMore: (hasMore) => set({ hasMore }),

  startChat: (friendId) => set({
    currentView: 'chat',
    activeChatId: friendId,
  }),

  resetStore: () => set(initialState),
}));

export default useFriendChatStore;