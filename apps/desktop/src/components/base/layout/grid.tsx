import React from "react";
import { cn } from "@/src/utils";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

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

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  cols?: GridCols;
  noGap?: boolean;
}

/* ─────────────────────────────────────────────
   Maps & Utilities
   ───────────────────────────────────────────── */

const gridColsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
  none: "grid-cols-none",
};

const getGridClass = (cols: GridCols) => {
  if (typeof cols === "object") {
    return Object.entries(cols)
      .map(([breakpoint, value]) => {
        const gridClass = gridColsMap[value as keyof typeof gridColsMap];
        if (breakpoint === "base") return gridClass;
        return `${breakpoint}:${gridClass}`;
      })
      .join(" ");
  }
  return gridColsMap[cols as keyof typeof gridColsMap];
};

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export const Grid = ({
  children,
  className,
  cols = 1,
  noGap,
  ...props
}: GridProps) => {
  return (
    <div
      className={cn("grid gap-5", getGridClass(cols), noGap && "gap-0", className)}
      {...props}
    >
      {children}
    </div>
  );
};
