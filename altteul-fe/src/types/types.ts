export interface User {
  roomId?: number;
  userId: number;
  nickname: string;
  profileImg: string;
  tierId: number;
}

export type Users = User[];

export interface TestCase {
  testcaseId: number;
  number: number;
  input: string;
  output: string;
}

export interface Problem {
  problemId: number;
  problemTitle: string;
  description: string;
}

export interface GameState {
  gameId: number | null;
  roomId: number | null;
  users: User[];
  problem: Problem | null;
  testcases: TestCase[];
  setGameInfo: (gameId: number, leaderId: number) => void;
  setUsers: (users: User[]) => void;
  setProblem: (problem: Problem) => void;
  setTestcases: (testcases: TestCase[]) => void;
}

type Language = 'python' | 'java';

export interface CodeExecutionState {
  code: string;
  language: Language;
  output: string[];
  setCode: (code: string) => void;
  setLanguage: (language: Language) => void;
  executeCode: () => void;
  clearOutput: () => void;
}

export interface UserInfoResponse {
  status: number;
  message: string;
  data: UserInfo;
}

export interface UserInfo {
  userId: number;
  username: string;
  nickname: string;
  profileImg: string;
  tierName: string;
  tierId: number;
  rankPercentile: number;
  rank: number;
  rankChange: number;
  isOwner: boolean;
}
export interface SingleMatchData {
  gameId?: number;
  roomId: number;
  leaderId: number;
  users?: User[];
  remainingUsers?: User[];
  problem?: Problem;
  testcases?: TestCase[];
}

export interface SingleEnterApiResponse {
  type?: string;
  data: SingleMatchData;
  message?: string;
  status?: string;
}

export interface RankingResponse {
  userId?: number;
  rank: number;
  nickname: string;
  mainLang: string;
  rankPoint: number;
  tierId: number;
  rankChange: number;
  averagePassRate: number;
}
export interface UserGameRecordResponse {
  status: number;
  message: string;
  data: {
    games: UserGameRecord[];
    last: boolean;
    totalPages: number;
    currentPage: number;
    totalElements: number;
  };
}

export interface UserGameRecord {
  problem: Problem;
  gameType: string;
  startedAt: string;
  totalHeadCount: number;
  items: Item[];
  myTeam: TeamInfo;
  opponents: TeamInfo[];
}

export interface Item {
  itemId: number;
  itemName: string;
}

export interface TeamInfo {
  gameResult: string;
  lang: string;
  totalHeadCount: number;
  executeTime: number | null;
  executeMemory: number | null;
  bonusPoint: number | null;
  duration: string | null;
  code: string | null;
  members: MemberInfo[];
}

export interface MemberInfo {
  userId: number;
  nickname: string;
  profileImage: string;
  rank: number;
  tierId: number;
}

export interface CodeInfo {
  executeMemory: number;
  executeTime: number;
  code: string;
}

export type UserSearchContextType = {
  searchQuery: string;
  searchResults: Friend[];
  handleSearch: (query: string) => void;
  resetSearch: () => void; // 검색 초기화
};

export type Friend = {
  userId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
};

export type FriendRequest = {
  friendRequestId: number;
  fromUserId: number;
  fromUserNickname: string;
  fromUserProfileImg: string;
  requestStatus: 'P' | 'A' | 'R';
};

export type ChatRoom = {
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
  recentMessage: string;
  isMessageRead: boolean;
  createdAt: string;
};

export type ChatMessage = {
  chatMessageId: number;
  senderId: number;
  senderNickname: string;
  messageContent: string;
  checked: boolean;
  createdAt: string;
};

export type Notification = {
  id: number;
  type: 'gameInvite' | 'friendRequest';
  from: {
    id: number;
    nickname: string;
    profileImg: string;
  };
  createdAt: string;
};

export interface NotificationUser {
  id: number;
  nickname: string;
  profileImg: string;
  isOnline?: boolean;
}

export interface NotificationItem {
  id: number;
  type: 'friendRequest' | 'gameInvite';
  from: NotificationUser;
  roomId?: number; // gameInvite일 때만 존재
  createdAt: string;
}
