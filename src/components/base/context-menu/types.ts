export type ContextMenuAction = {
  type?: "action";
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  children?: ContextMenuAction[];
};

export type ContextMenuDivider = {
  type: "divider";
  id: string;
};

export type ContextMenuItem = ContextMenuAction | ContextMenuDivider;

export type ContextMenuState = {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
};