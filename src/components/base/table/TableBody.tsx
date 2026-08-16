import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/src/utils";
import type { TableColumn } from "./table.types";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

export interface TableBodyProps<T extends Record<string, unknown>> {
  activeColumns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T & string;
  isLoading: boolean;
  emptyState?: React.ReactNode;
}

/* ─────────────────────────────────────────────
   TableBody
   Renders: loading skeletons | empty state | data rows
   ───────────────────────────────────────────── */

export function TableBody<T extends Record<string, unknown>>({
  activeColumns,
  data,
  rowKey,
  isLoading,
  emptyState,
}: TableBodyProps<T>) {
  /* — Loading skeleton ———————————————— */
  if (isLoading) {
    return (
      <tbody>
        {Array.from({ length: 5 }).map((_, i) => (
          <tr key={i} className="border-b border-slate-1/50 last:border-0">
            {activeColumns.map((col) => (
              <td key={col.id} className="px-4 py-3">
                <div className="h-3.5 rounded-md bg-dark-6 animate-pulse" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  /* — Empty state ——————————————————— */
  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={activeColumns.length}>
            {emptyState ?? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <div className="w-10 h-10 rounded-xl bg-dark-6 flex items-center justify-center">
                  <Search size={18} strokeWidth={1.5} className="text-chalk-25" />
                </div>
                <p className="text-sm font-medium text-chalk-40">No results found</p>
                <p className="text-xs text-chalk-25">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </td>
        </tr>
      </tbody>
    );
  }

  /* — Data rows ———————————————————— */
  return (
    <tbody>
      {data.map((row) => (
        <tr
          key={String(row[rowKey])}
          className={cn(
            "border-b border-slate-1/40 last:border-0",
            "hover:bg-dark-5/60 transition-colors duration-100",
          )}
        >
          {activeColumns.map((col) => {
            const value = row[col.key as keyof T];
            const alignClass =
              col.align === "center"
                ? "text-center"
                : col.align === "right"
                  ? "text-right"
                  : "text-left";
            return (
              <td
                key={col.id}
                className={cn(
                  "px-4 py-3 text-sm text-chalk-60 whitespace-nowrap",
                  alignClass,
                )}
              >
                {col.cell
                  ? col.cell(value as T[keyof T], row)
                  : (value as React.ReactNode) ?? "-"}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
