/**
 *============================================
 *? types
 *============================================
 */
export type ButtonVariant = "primary" | "outline" | "primaryOutline";
export type RoundedStyle = "full" | "lg" | "md" | "sm" | "none";

/**
 *============================================
 *? Interfaces
 *============================================
 */
export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant: ButtonVariant;
  rounded?: RoundedStyle;
}
