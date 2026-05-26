import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationProps } from "./types";

export function Pagination({
  page,
  totalPages,
  onNext,
  onPrev,
}: PaginationProps) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="flex justify-end items-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirstPage}
        className="flex justify-center items-center disabled:opacity-50 border rounded-md w-9 h-9 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={18} />
      </button>

      <p className="text-sm">
        Page {page} of {totalPages}
      </p>

      <button
        type="button"
        onClick={onNext}
        disabled={isLastPage}
        className="flex justify-center items-center disabled:opacity-50 border rounded-md w-9 h-9 disabled:cursor-not-allowed"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}