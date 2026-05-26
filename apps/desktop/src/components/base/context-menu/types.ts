export type ContextMenuItem = {
  id: string;
  label: string;
  onClick?: () => void;

  disabled?: boolean;
  children?: ContextMenuItem[];
};

export type ContextMenuState = {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
};