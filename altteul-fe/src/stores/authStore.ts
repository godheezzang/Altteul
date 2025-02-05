import { User } from "types/types";
import { create } from "zustand";

// 임시로 만든 로그인 전역 상태 관리

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
}));

export default useAuthStore;
