// src/stores/modalStore.ts
import { create } from "zustand";
import { ModalInfo } from "types/modalTypes";

interface ModalState {
  currentModal: string | null;
  modalInfo: ModalInfo | null;
  openModal: (modalName: string, info?: ModalInfo) => void;
  closeModal: () => void;
  isOpen: (modalName: string) => boolean;
  getModalInfo: () => ModalInfo | null;
}

const useModalStore = create<ModalState>((set, get) => ({
  currentModal: null,
  modalInfo: null,
  openModal: (modalName, info = null) => set({ 
    currentModal: modalName,
    modalInfo: info
  }),
  closeModal: () => set({ 
    currentModal: null,
    modalInfo: null 
  }),
  isOpen: (modalName) => get().currentModal === modalName,
  getModalInfo: () => get().modalInfo,
}));

export default useModalStore;