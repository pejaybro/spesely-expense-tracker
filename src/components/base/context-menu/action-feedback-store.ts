import { create } from "zustand";

type ActionFeedbackState = {
  isOpen: boolean;
  x: number;
  y: number;
  label: string;
  trigger: (x: number, y: number, label: string) => void;
  close: () => void;
};

let timeoutId: any = null;

export const useActionFeedbackStore = create<ActionFeedbackState>((set) => ({
  isOpen: false,
  x: 0,
  y: 0,
  label: "",

  trigger: (x, y, label) => {
    if (timeoutId) clearTimeout(timeoutId);
    set({ isOpen: true, x, y, label });
    timeoutId = setTimeout(() => {
      set({ isOpen: false });
    }, 1000);
  },

  close: () => {
    if (timeoutId) clearTimeout(timeoutId);
    set({ isOpen: false });
  },
}));
