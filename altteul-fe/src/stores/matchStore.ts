// src/stores/matchStore.ts
import { create } from 'zustand'
import { SingleMatchData, SingleEnterApiResponse } from "types/types";

interface MatchStore {
  matchData: SingleMatchData | null;
  message: string | null;
  status: string | null;
  isLoading: boolean;
  error: string | null;
  
  setMatchData: (response: SingleEnterApiResponse) => void;
  clearMatchData: () => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matchData: null,
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