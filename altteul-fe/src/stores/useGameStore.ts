import { GameState } from 'types/types';
import { create } from 'zustand';

const useGameStore = create<GameState>(set => ({
  gameId: null,
  roomId: null,
  users: [],
  problem: {
    problemId: 0,
    problemTitle: '',
    description: '',
  },
  testcases: [],

  setGameInfo: (gameId: number, roomId: number) => set({ gameId, roomId }),
  setUsers: users => set({ users }),
  setProblem: problem => set({ problem }),
  setTestcases: testcases => set({ testcases }),
}));

export default useGameStore;
