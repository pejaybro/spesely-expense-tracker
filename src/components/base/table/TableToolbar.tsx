import { RotateCcw, Filter, Download, Search } from "lucide-react";
import { cn } from "@/src/utils";
import { Tooltip } from "@/src/pejay-ui/components/overlays";
import type { TableToolbarProps } from "./table.types";

/* ─────────────────────────────────────────────
   TableToolbar
   Top section: search bar | filter | export | reset | extra slot
   ───────────────────────────────────────────── */

export const TableToolbar = ({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onReset,
  onFilterClick,
  onExportClick,
  isFilterActive = false,
  extraActions,
}: TableToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-3 w-full flex-wrap">
      {/* Left: search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-chalk-30 pointer-events-none"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={cn(
            "w-full h-8 pl-8 pr-3 rounded-lg text-xs",
            "bg-dark-5 border border-slate-1 text-chalk-70",
            "placeholder:text-chalk-25",
            "focus:outline-none focus:border-slate-2",
            "transition-colors duration-150",
          )}
        />
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-1.5">
        {/* Filter button */}
        {onFilterClick && (
          <Tooltip content="Filters" direction="top">
            <button
              type="button"
              onClick={onFilterClick}
              className={cn(
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium",
                "border transition-colors duration-150 cursor-pointer",
                isFilterActive
                  ? "bg-exp-1/20 border-exp-3/40 text-exp-4"
                  : "bg-dark-5 border-slate-1 text-chalk-40 hover:text-chalk-70 hover:border-slate-2",
              )}
            >
              <Filter size={13} />
              <span>Filter</span>
              {isFilterActive && (
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-exp-3 text-white text-[9px] font-bold">
                  !
                </span>
              )}
            </button>
          </Tooltip>
        )}

        {/* Export button */}
        {onExportClick && (
          <Tooltip content="Export CSV" direction="top">
            <button
              type="button"
              onClick={onExportClick}
              className={cn(
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium",
                "bg-dark-5 border border-slate-1 text-chalk-40",
                "hover:text-chalk-70 hover:border-slate-2",
                "transition-colors duration-150 cursor-pointer",
              )}
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          </Tooltip>
        )}

        {/* Extra actions slot */}
        {extraActions}

        {/* Reset button */}
        <Tooltip content="Reset" direction="top">
          <button
            type="button"
            onClick={onReset}
            className={cn(
              "inline-flex items-center justify-center h-8 w-8 rounded-lg",
              "bg-dark-5 border border-slate-1 text-chalk-40",
              "hover:text-chalk-70 hover:border-slate-2",
              "transition-colors duration-150 cursor-pointer",
            )}
          >
            <RotateCcw size={13} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
