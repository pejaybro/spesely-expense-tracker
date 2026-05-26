import type { ContextMenuItem } from "./types";

export const BASE_MENU_RIGHT_CLICK: ContextMenuItem[] = [
  {
    id: "refresh",
    label: "Refresh",
    onClick: () => window.location.reload(),
  },
  {
    id: "back",
    label: "Back",
    onClick: () => window.history.back(),
  },
  {
    id: "forward",
    label: "Forward",
    onClick: () => window.history.forward(),
  },
];