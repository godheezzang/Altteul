import { create } from 'zustand';

interface SocketState {
  keepConnection: boolean;
  setKeepConnection: (keep: boolean) => void;
  resetConnection: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  keepConnection: false,
  setKeepConnection: (keep: boolean) => set({ keepConnection: keep }),
  resetConnection: () => set({ keepConnection: false }),
}));