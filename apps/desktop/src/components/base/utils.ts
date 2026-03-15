import { gridColsMap } from "@/src/utils";
import type { GridCols } from "@/root.config";

/**
 * NOTE : Utility to generate grid column classes based on a responsive cols prop.
 */
export const getGridClass = (cols: GridCols) => {
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
