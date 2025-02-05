import { create } from "zustand";

interface ModalState {
  currentModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;
  isOpen: (modalName: string) => boolean;
}

const useModalStore = create<ModalState>((set, get) => ({
  currentModal: null,
  openModal: (modalName) => set({ currentModal: modalName }),
  closeModal: () => set({ currentModal: null }),
  isOpen: (modalName) => get().currentModal === modalName,
}));

export default useModalStore;
