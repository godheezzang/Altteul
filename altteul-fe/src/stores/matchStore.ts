// src/stores/matchStore.ts
import { create } from 'zustand'
import { MatchData, SingleEnterApiResponse } from "types/types";

interface MatchStore {
  matchData: MatchData;
  isLoading: boolean;
  
  setMatchData: (response: MatchData) => void;
  clearMatchData: () => void;
  setLoading: (loading: boolean) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matchData: JSON.parse(sessionStorage.getItem("matchData")) || {users: [], roomId: 0, leaderId: 0},
  message: sessionStorage.getItem("matchMessage"),
  status: sessionStorage.getItem("matchStatus"),
  isLoading: false,
  error: sessionStorage.getItem("matchError"),

  setMatchData: (response) => {
    sessionStorage.setItem("matchData", JSON.stringify(response));
    set({ 
      matchData: response,
    });
  },

  clearMatchData: () => {
    sessionStorage.removeItem("matchData");
    sessionStorage.removeItem("matchMessage");
    sessionStorage.removeItem("matchStatus");
    sessionStorage.removeItem("matchError");
    
    set({ 
      matchData: null,
    });
  },


  setLoading: (loading) => set({ isLoading: loading }),
}));