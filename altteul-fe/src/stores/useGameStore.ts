import { GameState } from 'types/types';
import { create } from 'zustand';

const useGameStore = create<GameState>((set) => ({
  gameId: null,
  leaderId: null,
  users: [],
  problem: {
    problemId: 0,
    problemTitle: '',
    description: '',
  },
  testcases: [],

  setGameInfo: (gameId, leaderId) => set({ gameId, leaderId }),
  setUsers: (users) => set({ users }),
  setProblem: (problem) => set({ problem }),
  setTestcases: (testcases) => set({ testcases }),
}));

export default useGameStore;
