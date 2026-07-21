import { create } from "zustand";
import type { ContextMenuItem, ContextMenuState } from "./types";
import { BASE_MENU_RIGHT_CLICK } from "./constants";

type Store = ContextMenuState & {
  open: (x: number, y: number, items?: ContextMenuItem[]) => void;
  close: () => void;
};

export const useContextMenuStore = create<Store>((set) => ({
  isOpen: false,
  x: 0,
  y: 0,
  items: BASE_MENU_RIGHT_CLICK,

  open: (x, y, items) =>
    set({
      isOpen: true,
      x,
      y,
      items: items ?? BASE_MENU_RIGHT_CLICK,
    }),

  close: () =>
    set({
      isOpen: false,
    }),
}));