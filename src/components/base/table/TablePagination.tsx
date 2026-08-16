import { cn } from "@/src/utils";

/* ─────────────────────────────────────────────
   TablePagination
   Left  → "Showing Page X of Y – total Z rows"
   Right → Previous | page numbers | … | last | Next
   ───────────────────────────────────────────── */

export interface TablePaginationProps {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of records across all pages */
  totalRecords: number;
  /** Label for records e.g. "expenses", "patients", "items" */
  recordLabel?: string;
  /** Called when the user clicks a page or Prev/Next */
  onPageChange: (page: number) => void;
}

/* ── Page number range builder ─────────────── */
function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 4) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 3) pages.push("...");

  pages.push(total);
  return pages;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  totalRecords,
  recordLabel = "records",
  onPageChange,
}: TablePaginationProps) => {
  const pages = buildPageRange(currentPage, totalPages);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 w-full",
        "px-4 py-3 rounded-xl",
        "bg-dark-4 border border-slate-1",
      )}
    >
      {/* ── Left: info text ──────────────────── */}
      <p className="text-xs text-chalk-40 whitespace-nowrap shrink-0">
        Showing Page{" "}
        <span className="text-chalk-70 font-semibold">{currentPage}</span> of{" "}
        <span className="text-chalk-70 font-semibold">{totalPages}</span>
        {" – "}total{" "}
        <span className="text-chalk-70 font-semibold">
          {totalRecords.toLocaleString()}
        </span>{" "}
        {recordLabel}
      </p>

      {/* ── Right: controls ──────────────────── */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => goTo(currentPage - 1)}
          className={cn(
            "h-8 px-3.5 rounded-lg text-xs font-medium",
            "border transition-colors duration-150 cursor-pointer",
            "bg-dark-5 border-slate-1 text-chalk-50",
            "hover:text-chalk-80 hover:border-slate-2",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-chalk-50 disabled:hover:border-slate-1",
          )}
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="w-8 text-center text-xs text-chalk-30 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => goTo(p as number)}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer",
                  p === currentPage
                    ? "bg-exp-1 border border-exp-3/60 text-white font-semibold"
                    : "text-chalk-40 hover:text-chalk-70 hover:bg-dark-5",
                )}
              >
                {p}
              </button>
            ),
          )}
        </div>

        {/* Next */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => goTo(currentPage + 1)}
          className={cn(
            "h-8 px-3.5 rounded-lg text-xs font-medium",
            "border transition-colors duration-150 cursor-pointer",
            "bg-exp-1 border-exp-3/40 text-white",
            "hover:bg-exp-2 hover:border-exp-3",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-exp-1 disabled:hover:border-exp-3/40",
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};
