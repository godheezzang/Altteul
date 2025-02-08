import { create } from 'zustand';

interface AuthState {
  token: string;
  setToken: (newToken: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token') || '',
  setToken: (newToken: string) => {
    const cleanToken = newToken.replace(/^Bearer\s+/i, '');
    localStorage.setItem('token', cleanToken); //로컬에 저장
    set({ token: cleanToken }); // zustand에 저장
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    set({ token: '' });
  },
}));

export default useAuthStore;
