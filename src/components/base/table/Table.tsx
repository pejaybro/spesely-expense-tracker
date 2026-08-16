import React, { useState, useMemo } from "react";
import { cn } from "@/src/utils";
import { TableToolbar } from "./TableToolbar";
import { TableHeaderCell } from "./TableHeaderCell";
import { TableBody } from "./TableBody";
import type { TableProps, SortState } from "./table.types";

/* ─────────────────────────────────────────────
   Table
   Orchestrates: Toolbar → Header → Body → Pagination
   ───────────────────────────────────────────── */

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  toolbar,
  onSortChange,
  pagination,
  emptyState,
  isLoading = false,
  className,
}: TableProps<T>) {
  const [internalSort, setInternalSort] = useState<SortState>({
    columnKey: null,
    direction: null,
  });

  /* Only render columns that are marked active */
  const activeColumns = useMemo(
    () => columns.filter((c) => c.isActive),
    [columns],
  );

  /* — Sort handler ———————————————————— */
  const handleSort = (key: string) => {
    const next: SortState = (() => {
      if (internalSort.columnKey !== key)
        return { columnKey: key, direction: "asc" };
      if (internalSort.direction === "asc")
        return { columnKey: key, direction: "desc" };
      return { columnKey: null, direction: null };
    })();

    setInternalSort(next);
    onSortChange?.(next);
  };

  /* — Client-side sort (skipped when onSortChange is provided) — */
  const sortedData = useMemo(() => {
    if (onSortChange || !internalSort.columnKey || !internalSort.direction) {
      return data;
    }
    const key = internalSort.columnKey as keyof T;
    return [...data].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av ?? "").localeCompare(String(bv ?? ""));
      return internalSort.direction === "asc" ? cmp : -cmp;
    });
  }, [data, internalSort, onSortChange]);

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {/* ── 1. Toolbar ─────────────────────────── */}
      {toolbar && <TableToolbar {...toolbar} />}

      {/* ── 2. Table (header + body) ───────────── */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-1 bg-dark-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {activeColumns.map((col) => (
                <TableHeaderCell
                  key={col.id}
                  col={col}
                  sortState={internalSort}
                  onSort={handleSort}
                />
              ))}
            </tr>
          </thead>

          <TableBody
            activeColumns={activeColumns}
            data={sortedData}
            rowKey={rowKey}
            isLoading={isLoading}
            emptyState={emptyState}
          />
        </table>
      </div>

      {/* ── 3. Pagination slot ─────────────────── */}
      {pagination && <div className="w-full">{pagination}</div>}
    </div>
  );
}
