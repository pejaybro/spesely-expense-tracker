import { useState, useMemo } from "react";
import {
  Tag,
  Calendar,
  DollarSign,
  Hash,
  FileText,
  Info,
  TrendingDown,
} from "lucide-react";
import { Table } from "@/src/components/base";
import type { TableColumn, TableToolbarProps } from "@/src/components/base";
import { TablePagination } from "@/src/components/base/table";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

interface ExpenseRow extends Record<string, unknown> {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

/* ─────────────────────────────────────────────
   Dummy data
   ───────────────────────────────────────────── */

const DUMMY_DATA: ExpenseRow[] = [
  {
    id: "exp-001",
    date: "2026-08-15",
    description: "Grocery Shopping at D-Mart",
    category: "Food & Groceries",
    amount: 1840.5,
  },
  {
    id: "exp-002",
    date: "2026-08-14",
    description: "Uber ride to office",
    category: "Transport",
    amount: 220.0,
  },
  {
    id: "exp-003",
    date: "2026-08-13",
    description: "Netflix monthly subscription",
    category: "Entertainment",
    amount: 649.0,
  },
  {
    id: "exp-004",
    date: "2026-08-12",
    description: "Electricity bill payment",
    category: "Utilities",
    amount: 3120.75,
  },
  {
    id: "exp-005",
    date: "2026-08-10",
    description: "Dinner at Barbeque Nation",
    category: "Dining Out",
    amount: 2450.0,
  },
];

/* ─────────────────────────────────────────────
   Column Definitions
   ───────────────────────────────────────────── */

const COLUMNS: TableColumn<ExpenseRow>[] = [
  {
    id: 0,
    key: "id",
    title: "Ref #",
    leftIcon: Hash,
    isActive: true,
    isSortable: false,
    width: "100px",
    hoverDescription: "Unique reference ID for each expense entry",
    rightIcon: Info,
    cell: (value) => (
      <span className="font-mono text-xs text-chalk-40">{String(value)}</span>
    ),
  },
  {
    id: 1,
    key: "date",
    title: "Date",
    leftIcon: Calendar,
    isActive: true,
    isSortable: true,
    width: "130px",
    hoverDescription: "Date when the expense was recorded",
    rightIcon: Info,
    cell: (value) => (
      <span className="text-chalk-60 text-xs">{String(value)}</span>
    ),
  },
  {
    id: 2,
    key: "description",
    title: "Description",
    leftIcon: FileText,
    isActive: true,
    isSortable: false,
    hoverDescription: "A short note or label for the expense",
    rightIcon: Info,
    cell: (value) => (
      <span className="text-chalk-80 font-medium">{String(value)}</span>
    ),
  },
  {
    id: 3,
    key: "category",
    title: "Category",
    leftIcon: Tag,
    isActive: true,
    isSortable: true,
    width: "160px",
    hoverDescription: "Expense category used for grouping and analysis",
    rightIcon: Info,
    cell: (value) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-dark-6 text-chalk-50 border border-slate-1">
        {String(value)}
      </span>
    ),
  },
  {
    id: 4,
    key: "amount",
    title: "Amount",
    leftIcon: DollarSign,
    isActive: true,
    isSortable: true,
    width: "120px",
    align: "right",
    hoverDescription: "Expense amount in Indian Rupees (₹)",
    rightIcon: Info,
    cell: (value) => (
      <span className="font-semibold text-exp-4">
        ₹{Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
];

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

const PAGE_SIZE = 3;

export const ExpenseArchiveTable = () => {
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* Client-side search filter */
  const filteredData = useMemo(() => {
    if (!search.trim()) return DUMMY_DATA;
    const q = search.toLowerCase();
    return DUMMY_DATA.filter(
      (row) =>
        row.description.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q),
    );
  }, [search]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const toolbar: TableToolbarProps = {
    searchValue: search,
    searchPlaceholder: "Search expenses...",
    onSearchChange: setSearch,
    onReset: () => {
      setSearch("");
      setFilterActive(false);
      setCurrentPage(1);
    },
    onFilterClick: () => setFilterActive((p) => !p),
    onExportClick: () => console.log("Export clicked"),
    isFilterActive: filterActive,
  };

  /* Total amount */
  const total = filteredData.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-exp-1">
          <TrendingDown size={16} className="text-exp-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-chalk-80">
            Expense Archive
          </h2>
          <p className="text-xs text-chalk-40">
            Custom Table component — 5 columns, sortable headers, search,
            toolbar
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-chalk-35">Total shown</p>
          <p className="text-sm font-semibold text-exp-4">
            ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Table */}
      <Table<ExpenseRow>
        columns={COLUMNS}
        data={pagedData}
        rowKey="id"
        toolbar={toolbar}
        pagination={
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={filteredData.length}
            recordLabel="expenses"
            onPageChange={(p) => setCurrentPage(p)}
          />
        }
      />
    </div>
  );
};
