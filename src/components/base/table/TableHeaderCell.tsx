import { ArrowUp, ArrowDown, ArrowUpDown, Info } from "lucide-react";
import { cn } from "@/src/utils";
import { Tooltip } from "@/src/pejay-ui/components/overlays";
import type { TableColumn, SortState } from "./table.types";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

export interface TableHeaderCellProps<T> {
  col: TableColumn<T>;
  sortState: SortState;
  onSort: (key: string) => void;
}

/* ─────────────────────────────────────────────
   TableHeaderCell
   Single <th>: left icon | title | sort arrow | right info tooltip
   ───────────────────────────────────────────── */

export function TableHeaderCell<T>({
  col,
  sortState,
  onSort,
}: TableHeaderCellProps<T>) {
  const LeftIcon = col.leftIcon;
  const RightIcon = col.rightIcon ?? Info;
  const showRightIcon = !!col.rightIcon || !!col.hoverDescription;

  const isSorted = sortState.columnKey === col.key;
  const direction = isSorted ? sortState.direction : null;

  const alignClass =
    col.align === "center"
      ? "justify-center"
      : col.align === "right"
        ? "justify-end"
        : "justify-start";

  return (
    <th
      style={{ width: col.width }}
      className={cn(
        "px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase",
        "text-chalk-30 border-b border-slate-1",
        "whitespace-nowrap select-none bg-dark-4",
        col.isSortable && "cursor-pointer hover:text-chalk-50 transition-colors duration-150",
      )}
      onClick={() => col.isSortable && onSort(col.key)}
    >
      <div className={cn("flex items-center gap-1.5", alignClass)}>
        {/* Left icon */}
        {LeftIcon && (
          <LeftIcon size={12} className="shrink-0 text-chalk-25" />
        )}

        {/* Title */}
        <span>{col.title}</span>

        {/* Sort indicator */}
        {col.isSortable && (
          <span className="ml-0.5">
            {direction === "asc" ? (
              <ArrowUp size={11} className="text-exp-4" />
            ) : direction === "desc" ? (
              <ArrowDown size={11} className="text-exp-4" />
            ) : (
              <ArrowUpDown size={11} className="text-chalk-20" />
            )}
          </span>
        )}

        {/* Right info icon with hover description */}
        {showRightIcon && (
          <Tooltip
            content={col.hoverDescription ?? col.title}
            direction="top"
          >
            <span
              className="inline-flex items-center cursor-help text-chalk-20 hover:text-chalk-40 transition-colors ml-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <RightIcon size={11} />
            </span>
          </Tooltip>
        )}
      </div>
    </th>
  );
}
