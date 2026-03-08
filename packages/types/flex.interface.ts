/**
 *============================================
 *? Types
 *============================================
 */

export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexJustify = "start" | "center" | "end" | "between" | "around";
export type FlexDirection = "row" | "column";

/**
 *============================================
 *? Interfaces
 *============================================
 */
export interface FlexProps {
  children?: React.ReactNode;
  items?: FlexAlign;
  justify?: FlexJustify;
  noGap?: boolean;
  direction: FlexDirection;
  className?: string;
}
