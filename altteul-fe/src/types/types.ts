export interface User {
  userId: number;
  nickname: string;
  profileImage: string;
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
  leaderId: number | null;
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
  tier: string;
  rankPercentile: number | null;
  rank: number | null;
  rankChange: number | null;
}
export interface SingleMatchData {
  roomId: number;
  leaderId: number;
  users?: User[];
  remainingUsers?: User[];
}

export interface SingleEnterApiResponse {
  type?: string;
  data: SingleMatchData;
  message?: string;
  status?: string;
}