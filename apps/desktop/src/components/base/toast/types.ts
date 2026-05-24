export const TOAST_TYPES = {
  INFO: "info",
  ERROR: "error",
  WARNING: "warning",
  SUCCESS: "success",
  CUSTOM: "custom",
};
export type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];

export type Listener = (toasts: ToastData[]) => void;
export interface ToastData {
  id?: string ;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  showClose?: boolean;
  dismiss?: string;
  icon?: React.ReactNode;
  className?: string;
  iconColor?: string;
  borderColor?: string;
  accentColor?: string;
  bgGlow?: string;
  bgColor?: string;
  titleColor?: string;
  descriptionColor?: string;
}
