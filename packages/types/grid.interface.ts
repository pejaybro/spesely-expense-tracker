/**
 *============================================
 *? Types
 *============================================
 */

export type GridColsValue =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | "none";

export interface ResponsiveGridCols {
  base?: GridColsValue;
  sm?: GridColsValue;
  md?: GridColsValue;
  lg?: GridColsValue;
  xl?: GridColsValue;
  "2xl"?: GridColsValue;
}

export type GridCols = GridColsValue | ResponsiveGridCols;

/**
 *============================================
 *? Interfaces
 *============================================
 */
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  cols?: GridCols;
  noGap?: boolean;
}
