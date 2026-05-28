import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from "lucide-react";
import type { PaginationProps } from "./types";
import { NumberInput } from "../form";

export function Pagination({
  page,
  totalPages,
  variant = "full",
  onNext,
  onPrev,
  onPageChange,
}: PaginationProps) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate page numbers with smart ellipsis logic
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageClick = (p: number) => {
    if (onPageChange) {
      onPageChange(p);
    } else {
      // Fallback if only onNext / onPrev are supplied
      if (p > page) {
        onNext();
      } else if (p < page) {
        onPrev();
      }
    }
  };

  /* ── Simple Mode ───────────────────────────────────────────── */
  if (variant === "simple") {
    return (
      <div className="flex items-center gap-3 select-none">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstPage}
          className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-zinc-500 text-xs font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={isLastPage}
          className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    );
  }

  /* ── Mini Mode ─────────────────────────────────────────────── */
  if (variant === "mini") {
    return (
      <div className="flex items-center gap-1.5 select-none">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstPage}
          className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-7 h-7 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronLeft size={13} />
        </button>
        <span className="text-zinc-500 px-1 text-[10px] font-semibold uppercase tracking-wider">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={isLastPage}
          className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-7 h-7 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    );
  }

  /* ── Dropdown Mode ─────────────────────────────────────────── */
  if (variant === "dropdown") {
    return (
      <div className="flex items-center gap-2 select-none text-xs font-semibold">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstPage}
          className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronLeft size={15} />
        </button>

        <div className="flex items-center gap-2 text-zinc-500 font-semibold relative animate-fade-in" ref={dropdownRef}>
          <span>Page</span>
          
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-1.5 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg px-2.5 h-8 min-w-[52px] transition-all duration-150 active:scale-95 text-xs font-medium focus:outline-none"
          >
            <span>{page}</span>
            <ChevronDown size={11} className={`opacity-60 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-800 rounded-lg py-1 shadow-2xl max-h-48 overflow-y-auto w-16 scrollbar-none z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === page;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      handlePageClick(p);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-center px-2 py-1.5 text-xs transition-colors hover:bg-zinc-900 ${
                      isActive ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          )}

          <span>of {totalPages}</span>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={isLastPage}
          className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    );
  }

  /* ── Input Mode ────────────────────────────────────────────── */
  if (variant === "input") {
    return (
      <div className="flex items-center gap-2 select-none text-xs font-semibold">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstPage}
          className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronLeft size={15} />
        </button>

        <div className="flex items-center gap-2 text-zinc-500 font-semibold">
          <span>Go to</span>
          <div className="w-12">
            <NumberInput
              showSteppers={false}
              min={1}
              max={totalPages}
              value={String(page)}
              key={page}
              variant="curved"
              wrapperClassName="border-radius-override"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = Number((e.target as HTMLInputElement).value);
                  if (val >= 1 && val <= totalPages) {
                    handlePageClick(val);
                  }
                }
              }}
              className="h-8 text-center text-xs bg-zinc-950/60 border-zinc-800 focus-within:border-zinc-700"
              inputClassName="text-center text-xs py-0 h-full w-full"
            />
          </div>
          <span>/ {totalPages}</span>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={isLastPage}
          className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    );
  }

  /* ── Numeric Mode ──────────────────────────────────────────── */
  if (variant === "numeric") {
    return (
      <div className="flex items-center gap-1.5 select-none">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstPage}
          className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
          title="Previous Page"
        >
          <ChevronLeft size={15} />
        </button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((item, idx) => {
            if (item === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-zinc-600 text-xs tracking-wider"
                >
                  ...
                </span>
              );
            }

            const pageNum = item as number;
            const isActive = pageNum === page;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => handlePageClick(pageNum)}
                className={`flex justify-center items-center text-xs font-medium rounded-lg w-8 h-8 transition-all duration-150 active:scale-95 ${
                  isActive
                    ? "bg-white text-black border border-white"
                    : "border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={isLastPage}
          className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
          title="Next Page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    );
  }

  /* ── Full Mode (Default) ───────────────────────────────────── */
  return (
    <div className="flex items-center gap-1.5 select-none">
      <button
        type="button"
        onClick={() => handlePageClick(1)}
        disabled={isFirstPage}
        className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        title="First Page"
      >
        <ChevronsLeft size={15} />
      </button>

      <button
        type="button"
        onClick={onPrev}
        disabled={isFirstPage}
        className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        title="Previous Page"
      >
        <ChevronLeft size={15} />
      </button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((item, idx) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 h-8 flex items-center justify-center text-zinc-600 text-xs tracking-wider"
              >
                ...
              </span>
            );
          }

          const pageNum = item as number;
          const isActive = pageNum === page;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => handlePageClick(pageNum)}
              className={`flex justify-center items-center text-xs font-medium rounded-lg w-8 h-8 transition-all duration-150 active:scale-95 ${
                isActive
                  ? "bg-white text-black border border-white"
                  : "border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={isLastPage}
        className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        title="Next Page"
      >
        <ChevronRight size={15} />
      </button>

      <button
        type="button"
        onClick={() => handlePageClick(totalPages)}
        disabled={isLastPage}
        className="flex justify-center items-center disabled:opacity-30 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg w-8 h-8 transition-all duration-150 disabled:cursor-not-allowed active:scale-95"
        title="Last Page"
      >
        <ChevronsRight size={15} />
      </button>
    </div>
  );
}