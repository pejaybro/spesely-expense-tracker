export type ContextMenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
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