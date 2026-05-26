export interface PaginationProps {
  page: number;
  totalPages: number;

  onNext: () => void;
  onPrev: () => void;
}