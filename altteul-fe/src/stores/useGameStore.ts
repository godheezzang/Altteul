// stores/useGameStore.ts
import { mockGameData } from "mocks/gameData";
import { Users, User } from "types/types";
import { create } from "zustand";

interface GameState {
  problemId: number | null;
  problemTitle: string | null;
  users: Users;
  setProblemInfo: (id: number, title: string) => void;
  setUsers: (users: Users) => void;
}

// Userㄴ 배열 -> 객체로 변환
const transformUsers = (users: User[]): Users =>
  users.map((user) => ({
    ...user,
    nickName: user.nickName,
    profileImg: user.profileImg,
  }));

const useGameStore = create<GameState>((set) => ({
  problemId: mockGameData.data.problem.problemId,
  problemTitle: mockGameData.data.problem.problemTitle,
  users: transformUsers(mockGameData.data.users),
  setProblemInfo: (id, title) => set({ problemId: id, problemTitle: title }),
  setUsers: (users) => set({ users }),
}));

export default useGameStore;
