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
  ranking: number;
  nickname: string;
  lang: string;
  point: number;
  tierId: number;
  rankChange: number;
  rate: number;
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

export interface RankApiFilter {
    page: number | null;
    size: number | null;
    lang: string | null;
    tier: number | null;
    keyword: string | null;
}