/**
 *============================================
 *? types
 *============================================
 */
export type ButtonVariant =
  | "solid"
  | "outline"
  | "solid-icon"
  | "outline-icon"
  | "soft"
  | "soft-icon"
  | "menu";
export type RoundedStyle = "full" | "lg" | "md" | "sm" | "none";

/**
 *============================================
 *? Interfaces
 *============================================
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  rounded?: RoundedStyle;
}
