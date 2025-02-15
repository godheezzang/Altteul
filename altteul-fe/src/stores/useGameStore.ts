import { GameState } from 'types/types';
import { create } from 'zustand';

const useGameStore = create<GameState>(set => ({
  // 사용자가 새로고침한 후에도 게임 정보를 유지하기 위해 로컬스토리지에 저장
  // TODO: 현재는 테스트를 위해 기본값 1로 해둠. null로 수정할 것
  gameId: Number(sessionStorage.getItem('gameId')) || null,
  roomId: Number(sessionStorage.getItem('roomId')) || null,
  users: JSON.parse(sessionStorage.getItem('users') || null),
  problem: JSON.parse(sessionStorage.getItem('problem') || null),
  testcases: JSON.parse(sessionStorage.getItem('testcases') || null),

  setGameInfo: (gameId: number, roomId: number) => {
    sessionStorage.setItem('gameId', gameId.toString());
    sessionStorage.setItem('roomId', roomId.toString());
    set({ gameId, roomId });
  },

  setUsers: users => {
    sessionStorage.setItem('users', JSON.stringify(users));
    set({ users });
  },

  setProblem: problem => {
    sessionStorage.setItem('problem', JSON.stringify(problem));
    set({ problem });
  },

  setTestcases: testcases => {
    sessionStorage.setItem('testcases', JSON.stringify(testcases));
    set({ testcases });
  },

  // 새로운 게임 시작 시 원래 게임 정보 초기화
  resetGameInfo: () => {
    sessionStorage.removeItem('gameId');
    sessionStorage.removeItem('roomId');
    sessionStorage.removeItem('users');
    sessionStorage.removeItem('problem');
    sessionStorage.removeItem('testcases');

    set({
      gameId: null,
      roomId: null,
      users: [],
      problem: null,
      testcases: [],
    });
  },
}));

export default useGameStore;
