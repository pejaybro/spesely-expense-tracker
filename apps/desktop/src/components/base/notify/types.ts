export type NotifyPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type NotifyVariant =
  | "default"
  | "success"
  | "error"
  | "info"
  | "warning";

export interface NotifyItem {
  id: string;
  title?: string;
  description?: string;
  position?: NotifyPosition;
  variant?: NotifyVariant;
}
