import type { LucideIcon } from "lucide-react";
import type React from "react";

/* ─────────────────────────────────────────────
   Column Definition
   ───────────────────────────────────────────── */

export interface TableColumn<T = Record<string, unknown>> {
  /** Unique numeric identifier for the column */
  id: number;
  /** The key used to access data from the row object */
  key: keyof T & string;
  /** Display label shown in the table header */
  title: string;
  /** Optional icon rendered on the left side of the header cell */
  leftIcon?: LucideIcon;
  /**
   * Optional icon rendered on the right side of the header cell.
   * When provided along with `hoverDescription`, renders as an info
   * button that shows the description in a tooltip on hover.
   */
  rightIcon?: LucideIcon;
  /** Tooltip description shown when hovering the right icon */
  hoverDescription?: string;
  /** Whether the column is rendered. Set false to hide it entirely. */
  isActive: boolean;
  /** Whether the column supports ascending/descending sort */
  isSortable: boolean;
  /** Optional fixed width for the column (e.g. "120px", "10%") */
  width?: string;
  /** Text alignment for both header and cells */
  align?: "left" | "center" | "right";
  /**
   * Optional custom cell renderer.
   * Receives the cell value and the full row object.
   */
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
}

/* ─────────────────────────────────────────────
   Sort State
   ───────────────────────────────────────────── */

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  columnKey: string | null;
  direction: SortDirection;
}

/* ─────────────────────────────────────────────
   Table Toolbar Props
   ───────────────────────────────────────────── */

export interface TableToolbarProps {
  /** Placeholder shown inside the search input */
  searchPlaceholder?: string;
  /** Current search term */
  searchValue: string;
  /** Called when the search input changes */
  onSearchChange: (value: string) => void;
  /** Called when the reset button is clicked */
  onReset: () => void;
  /** Called when the filter button is clicked (open panel / modal) */
  onFilterClick?: () => void;
  /** Called when the export button is clicked */
  onExportClick?: () => void;
  /** Whether the filter button should appear active/highlighted */
  isFilterActive?: boolean;
  /** Additional slot — pass any extra buttons/controls here */
  extraActions?: React.ReactNode;
}

/* ─────────────────────────────────────────────
   Table Props
   ───────────────────────────────────────────── */

export interface TableProps<T = Record<string, unknown>> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Data rows */
  data: T[];
  /** Unique key field used as React key for each row */
  rowKey: keyof T & string;
  /** Toolbar configuration — omit to hide the toolbar entirely */
  toolbar?: TableToolbarProps;
  /** Called when sort changes. If omitted, sorting is handled client-side */
  onSortChange?: (sort: SortState) => void;
  /** Slot for a Pagination component rendered below the table body */
  pagination?: React.ReactNode;
  /** Optional empty state node shown when data.length === 0 */
  emptyState?: React.ReactNode;
  /** When true, renders a skeleton loading state */
  isLoading?: boolean;
  /** Extra class names on the root wrapper */
  className?: string;
}
