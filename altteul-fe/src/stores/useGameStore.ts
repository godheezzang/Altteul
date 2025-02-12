import { GameState } from 'types/types';
import { create } from 'zustand';

const useGameStore = create<GameState>(set => ({
  // 사용자가 새로고침한 후에도 게임 정보를 유지하기 위해 로컬스토리지에 저장
  // TODO: 현재는 테스트를 위해 기본값 1로 해둠. null로 수정할 것
  gameId: localStorage.getItem('gameId') ? Number(localStorage.getItem('gameId')) : 1,
  roomId: localStorage.getItem('roomId') ? Number(localStorage.getItem('roomId')) : 1,
  users: JSON.parse(localStorage.getItem('users') || `[{"roomId":1, "userId":2,"nickname":"닉넴2","profileImg":"이미지Byte", "tierId":"티어"},
			  {"roomId":2, "userId":3,"nickname":"닉넴3","profileImg":"이미지Byte", "tierId":"티어"},
			  {"roomId":3, "userId":4,"nickname":"닉넴4","profileImg":"이미지Byte", "tierId":"티어"}]`),
  problem: JSON.parse(localStorage.getItem('problem') || '{"problemId": 1}'),
  testcases: JSON.parse(localStorage.getItem('testcases') || '[]'),

  setGameInfo: (gameId: number, roomId: number) => {
    localStorage.setItem('gameId', gameId.toString());
    localStorage.setItem('roomId', roomId.toString());
    set({ gameId, roomId });
  },

  setUsers: users => {
    localStorage.setItem('users', JSON.stringify(users));
    set({ users });
  },

  setProblem: problem => {
    localStorage.setItem('problem', JSON.stringify(problem));
    set({ problem });
  },

  setTestcases: testcases => {
    localStorage.setItem('testcases', JSON.stringify(testcases));
    set({ testcases });
  },

  // 새로운 게임 시작 시 원래 게임 정보 초기화
  resetGameInfo: () => {
    localStorage.removeItem('gameId');
    localStorage.removeItem('roomId');
    localStorage.removeItem('users');
    localStorage.removeItem('problem');
    localStorage.removeItem('testcases');

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
