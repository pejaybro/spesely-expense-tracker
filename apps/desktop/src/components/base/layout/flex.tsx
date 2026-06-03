import React from "react";
import { cn } from "@/src/utils";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexJustify = "start" | "center" | "end" | "between" | "around";
export type FlexDirection = "row" | "column";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  items?: FlexAlign;
  justify?: FlexJustify;
  noGap?: boolean;
  direction?: FlexDirection;
  wrap?: boolean;
}

/* ─────────────────────────────────────────────
   Maps
   ───────────────────────────────────────────── */

const itemsMap: Record<FlexAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyMap: Record<FlexJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

const flexDirectionMap: Record<FlexDirection, string> = {
  row: "flex-row",
  column: "flex-col",
};

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export const Flex = ({
  children,
  className,
  items = "start",
  justify = "start",
  noGap,
  direction = "row",
  wrap,
  ...props
}: FlexProps) => {
  return (
    <div
      className={cn(
        "flex gap-5",
        flexDirectionMap[direction],
        itemsMap[items],
        justifyMap[justify],
        noGap && "gap-0",
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
