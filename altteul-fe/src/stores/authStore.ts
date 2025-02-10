import { create } from "zustand";

interface AuthState {
  token: string;
  userId: string;
  setToken: (newToken: string) => void;
  setUserId: (newUserId: string | number) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token") || "",
  userId: localStorage.getItem("userId") || "",

  setToken: (newToken: string) => {
    const cleanToken = newToken.replace(/^Bearer\s+/i, "");
    localStorage.setItem("token", cleanToken); //로컬에 저장
    set({ token: cleanToken }); // zustand에 저장
  },

  setUserId: (newUserId: string | number) => {
    localStorage.setItem("userId", newUserId.toString());
    set({ userId: newUserId.toString() });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    set({ token: "", userId: "" });
  },
}));

export default useAuthStore;
