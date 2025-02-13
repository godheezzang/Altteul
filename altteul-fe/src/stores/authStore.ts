import { create } from "zustand";

interface AuthState {
  token: string;
  userId: string;
  setToken: (newToken: string) => void;
  setUserId: (newUserId: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token:sessionStorage.getItem("token") || "",
  userId:sessionStorage.getItem("userId") || "",

  setToken: (newToken: string) => {
  sessionStorage.setItem("token", newToken); //로컬에 저장
    set({ token: newToken }); // zustand에 저장
  },

  setUserId: (newUserId: string) => {
  sessionStorage.setItem("userId", newUserId);
    set({ userId: newUserId.toString() });
  },

  logout: () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
    set({ token: "", userId: "" });
  },
}));

export default useAuthStore;
