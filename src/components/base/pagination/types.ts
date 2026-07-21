export interface PaginationProps {
  page: number;
  totalPages: number;
  variant?: "simple" | "numeric" | "full" | "mini" | "dropdown" | "input";

  onNext: () => void;
  onPrev: () => void;
  onPageChange?: (page: number) => void;
}