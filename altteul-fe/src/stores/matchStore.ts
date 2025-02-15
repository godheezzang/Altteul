// src/stores/matchStore.ts
import { create } from 'zustand'
import { SingleMatchData, SingleEnterApiResponse } from "types/types";

interface MatchStore {
  matchData: SingleMatchData;
  message: string;
  status: string;
  isLoading: boolean;
  error: string;
  
  setMatchData: (response: SingleEnterApiResponse) => void;
  clearMatchData: () => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matchData: JSON.parse(sessionStorage.getItem("matchData")) || {users: [], roomId: 0, leaderId: 0},
  message: null,
  status: null,
  isLoading: false,
  error: null,

  setMatchData: (response) => set({ 
    matchData: response.data,
    message: response.message,
    status: response.status,
    error: null 
  }),
  clearMatchData: () => set({ 
    matchData: null,
    message: null,
    status: null 
  }),
  setError: (error) => set({ 
    error,
    matchData: null,
    message: null,
    status: null 
  }),
  setLoading: (loading) => set({ isLoading: loading }),
}));