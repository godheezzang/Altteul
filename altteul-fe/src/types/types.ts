export interface User {
  userId: number;
  nickName: string;
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
  leaderId: number | null;
  users: User[];
  problem: Problem | null;
  testcases: TestCase[];
  setGameInfo: (gameId: number, leaderId: number) => void;
  setUsers: (users: User[]) => void;
  setProblem: (problem: Problem) => void;
  setTestcases: (testcases: TestCase[]) => void;
}
