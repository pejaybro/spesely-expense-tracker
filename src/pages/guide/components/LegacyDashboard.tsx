import { useState, useMemo } from "react";
import { Flex, DatePicker } from "@/src/components/base";
import { SelectInput } from "@/src/pejay-ui/components";
import { MoveDown, TrendingUp } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday as isTodayDateFns,
  format,
} from "date-fns";
import { cn } from "@/src/pejay-ui/utils/cn";
import {
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Heading,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  PlusCircle,
} from "lucide-react";

const demoOptions = [
  { id: "1", label: "label-1", key: "value-1" },
  { id: "2", label: "label-2", key: "value-2" },
  { id: "3", label: "label-3", key: "value-3" },
];

export const LegacyDashboard = () => {
  const [selectedDemoOption, setSelectedDemoOption] = useState<any>(demoOptions[0]);

  // Generate current month's grid (padded to full weeks) using date-fns
  const heatmapWeeks = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    // Start of the first week of the month (starting on Monday)
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    // End of the last week of the month (ending on Sunday)
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

    // Chunk allDays into weeks (7 days each)
    const weeks: { date: Date; isCurrentMonth: boolean; isToday: boolean; }[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      const week = allDays.slice(i, i + 7).map((date) => {
        const currentMonth = isSameMonth(date, today);
        return {
          date,
          isCurrentMonth: currentMonth,
          isToday: isTodayDateFns(date),
        };
      });
      weeks.push(week);
    }
    return weeks;
  }, []);

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // --- FORM VERSION 1 STATES ---
  const [type, setType] = useState<"expense" | "income">("expense");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [date, setDate] = useState("Today");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const tagsList =
    type === "expense"
      ? ["Food", "Transport", "Rent", "Entertainment", "Utilities", "Travel"]
      : ["Salary", "Freelance", "Investment", "Gift", "Refund"];

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const datesList = ["Today", "Yesterday", "Last 7 Days", "Custom Date"];

  // --- FORM VERSION 2 STATES (Compact, Single-Select, Clear Actions) ---
  const [v2Type, setV2Type] = useState<"expense" | "income">("expense");
  const [v2Title, setV2Title] = useState("");
  const [v2Description, setV2Description] = useState("");
  const [v2Amount, setV2Amount] = useState("");
  const [v2SelectedTag, setV2SelectedTag] = useState<string | null>(null);
  const [v2Date, setV2Date] = useState<Date | undefined>(new Date());
  const [v2ShowDatePicker, setV2ShowDatePicker] = useState(false);

  const v2TagsList =
    v2Type === "expense"
      ? ["Food", "Transport", "Rent", "Entertainment", "Utilities", "Travel"]
      : ["Salary", "Freelance", "Investment", "Gift", "Refund"];

  const handleV2Reset = () => {
    setV2Title("");
    setV2Description("");
    setV2Amount("");
    setV2SelectedTag(null);
    setV2Date(new Date());
    setV2ShowDatePicker(false);
  };

  // --- FORM VERSION 3 STATES (Compact, Inline Calendar, Clear Actions) ---
  const [v3Type, setV3Type] = useState<"expense" | "income">("expense");
  const [v3Title, setV3Title] = useState("");
  const [v3Description, setV3Description] = useState("");
  const [v3Amount, setV3Amount] = useState("");
  const [v3SelectedTag, setV3SelectedTag] = useState<string | null>(null);
  const [v3Date, setV3Date] = useState<Date>(new Date());
  const [v3ViewMonth, setV3ViewMonth] = useState<number>(new Date().getMonth());
  const [v3ViewYear, setV3ViewYear] = useState<number>(new Date().getFullYear());

  const v3TagsList =
    v3Type === "expense"
      ? ["Food", "Transport", "Rent", "Entertainment", "Utilities", "Travel"]
      : ["Salary", "Freelance", "Investment", "Gift", "Refund"];

  const handleV3Reset = () => {
    setV3Title("");
    setV3Description("");
    setV3Amount("");
    setV3SelectedTag(null);
    setV3Date(new Date());
    setV3ViewMonth(new Date().getMonth());
    setV3ViewYear(new Date().getFullYear());
  };

  // --- FORM VERSION 4 STATES (Compact, Inline Calendar, Clear Actions) ---
  const [v4Type, setV4Type] = useState<"expense" | "income">("expense");
  const [v4Title, setV4Title] = useState("");
  const [v4Description, setV4Description] = useState("");
  const [v4Amount, setV4Amount] = useState("");
  const [v4SelectedTag, setV4SelectedTag] = useState<string | null>(null);
  const [v4Date, setV4Date] = useState<Date>(new Date());
  const [v4ViewMonth, setV4ViewMonth] = useState<number>(new Date().getMonth());
  const [v4ViewYear, setV4ViewYear] = useState<number>(new Date().getFullYear());

  const v4TagsList =
    v4Type === "expense"
      ? ["Food", "Transport", "Rent", "Entertainment", "Utilities", "Travel"]
      : ["Salary", "Freelance", "Investment", "Gift", "Refund"];

  const handleV4Reset = () => {
    setV4Title("");
    setV4Description("");
    setV4Amount("");
    setV4SelectedTag(null);
    setV4Date(new Date());
    setV4ViewMonth(new Date().getMonth());
    setV4ViewYear(new Date().getFullYear());
  };

  const getV4CalendarDays = () => {
    const firstDayIndex = new Date(v4ViewYear, v4ViewMonth, 1).getDay();
    const adjustedIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Mon starts week
    const totalDays = new Date(v4ViewYear, v4ViewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(v4ViewYear, v4ViewMonth, 0).getDate();

    const days: { day: number; month: number; year: number; isCurrentMonth: boolean; }[] = [];
    // Previous Month padding
    for (let i = adjustedIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: v4ViewMonth === 0 ? 11 : v4ViewMonth - 1,
        year: v4ViewMonth === 0 ? v4ViewYear - 1 : v4ViewYear,
        isCurrentMonth: false,
      });
    }
    // Current Month
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        month: v4ViewMonth,
        year: v4ViewYear,
        isCurrentMonth: true,
      });
    }
    // Next Month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: v4ViewMonth === 11 ? 0 : v4ViewMonth + 1,
        year: v4ViewMonth === 11 ? v4ViewYear + 1 : v4ViewYear,
        isCurrentMonth: false,
      });
    }
    return days;
  };

  // --- Calendar calculations for Version 3 ---
  const v3Months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const v3Years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - 7 + i);

  const getCalendarDays = () => {
    const firstDayIndex = new Date(v3ViewYear, v3ViewMonth, 1).getDay();
    const adjustedIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Mon starts week
    const totalDays = new Date(v3ViewYear, v3ViewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(v3ViewYear, v3ViewMonth, 0).getDate();

    const days: { day: number; month: number; year: number; isCurrentMonth: boolean; }[] = [];
    // Previous Month padding
    for (let i = adjustedIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: v3ViewMonth === 0 ? 11 : v3ViewMonth - 1,
        year: v3ViewMonth === 0 ? v3ViewYear - 1 : v3ViewYear,
        isCurrentMonth: false,
      });
    }
    // Current Month
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        month: v3ViewMonth,
        year: v3ViewYear,
        isCurrentMonth: true,
      });
    }
    // Next Month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: v3ViewMonth === 11 ? 0 : v3ViewMonth + 1,
        year: v3ViewMonth === 11 ? v3ViewYear + 1 : v3ViewYear,
        isCurrentMonth: false,
      });
    }
    return days;
  };

  return (
    <Flex direction="column" className="w-full p-8 gap-12 bg-zinc-950 text-white">
      {/* --- Page Header --- */}
      <div>
        <h1 className="text-5xl font-black tracking-tight text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Compare transaction logging layouts. Version 1 is stacked; Version 2 is an optimized 2-column desktop grid.
        </p>
      </div>

      {/* ======================================================== */}
      {/* SECTION: FORM VERSION 1 (Stacked Layout) */}
      {/* ======================================================== */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400">
            Version 1.0
          </span>
          <h2 className="text-lg font-bold text-zinc-300">Traditional Stacked Form</h2>
        </div>

        <div className="w-full max-w-xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
          <div
            className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 transition-colors duration-500 ${
              type === "expense" ? "bg-amber-500" : "bg-emerald-500"
            }`}
          />

          <div className="relative z-10 flex flex-col gap-6">
            {/* Segment Picker */}
            <div className="grid grid-cols-2 p-1 bg-zinc-950/80 border border-zinc-800/50 rounded-xl">
              <button
                onClick={() => {
                  setType("expense");
                  setSelectedTags([]);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  type === "expense"
                    ? "bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/30 text-amber-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <ArrowUpRight size={16} />
                Expense
              </button>
              <button
                onClick={() => {
                  setType("income");
                  setSelectedTags([]);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  type === "income"
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <ArrowDownLeft size={16} />
                Income
              </button>
            </div>

            {/* Big Amount Header */}
            <div className="flex flex-col items-center justify-center py-4 border-b border-zinc-800/50">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-1">
                Transaction Amount
              </span>
              <div className="flex items-center relative">
                <DollarSign
                  className={`w-8 h-8 transition-colors duration-500 ${
                    type === "expense" ? "text-amber-500" : "text-emerald-500"
                  }`}
                />
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-4xl md:text-5xl font-black text-white focus:outline-none placeholder-zinc-800 text-center w-64"
                />
              </div>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <Heading size={12} />
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={type === "expense" ? "e.g., Grocery Shopping" : "e.g., Monthly Salary"}
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-750 focus:ring-1 focus:ring-zinc-750 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <FileText size={12} />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional notes..."
                  rows={2}
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-750 focus:ring-1 focus:ring-zinc-750 transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <Calendar size={12} />
                  Date
                </label>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full flex items-between justify-between bg-zinc-950/60 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-300 text-left"
                >
                  <span>{date}</span>
                  <ChevronDown size={16} className="text-zinc-500" />
                </button>

                {showDatePicker && (
                  <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-zinc-900 border border-zinc-800 rounded-xl p-1 z-20">
                    {datesList.map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setDate(d);
                          setShowDatePicker(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <Tag size={12} />
                  Tags / Categories (Multi-select)
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagsList.map((tag) => {
                    const isActive = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                          isActive
                            ? type === "expense"
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                              : "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                            : "bg-zinc-950/40 border-zinc-800/80 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`w-full mt-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                type === "expense"
                  ? "bg-gradient-to-r from-amber-500 to-red-500 text-zinc-950"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950"
              }`}
            >
              Log Transaction
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: FORM VERSION 2 (Optimized Compact 2-Column Grid) */}
      {/* ======================================================== */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-bold text-emerald-400">
            Version 2.0 (Recommended)
          </span>
          <h2 className="text-lg font-bold text-zinc-300">Modern 2-Column Grid Ledger</h2>
        </div>

        <div className="w-full max-w-xl bg-zinc-900/30 border border-zinc-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
          {/* Subtle accent line on top that matches form type */}
          <div
            className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 ${
              v2Type === "expense"
                ? "bg-gradient-to-r from-amber-500 to-red-500"
                : "bg-gradient-to-r from-emerald-500 to-teal-500"
            }`}
          />

          <div className="relative z-10 flex flex-col gap-5">
            {/* Header with Type selector and Reset button */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex p-0.5 bg-zinc-950/80 border border-zinc-800/50 rounded-lg">
                <button
                  onClick={() => {
                    setV2Type("expense");
                    setV2SelectedTag(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                    v2Type === "expense"
                      ? "bg-amber-500/10 text-amber-400 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Expense
                </button>
                <button
                  onClick={() => {
                    setV2Type("income");
                    setV2SelectedTag(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                    v2Type === "income"
                      ? "bg-emerald-500/10 text-emerald-400 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Income
                </button>
              </div>

              <button
                onClick={handleV2Reset}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
              >
                <RefreshCw size={12} />
                Reset
              </button>
            </div>

            {/* Form Fields: Two-Column Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Title Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                  <Heading size={10} />
                  Title
                </label>
                <input
                  type="text"
                  value={v2Title}
                  onChange={(e) => setV2Title(e.target.value)}
                  placeholder={v2Type === "expense" ? "Grocery, Rent..." : "Salary, Bonus..."}
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-all duration-200"
                />
              </div>

              {/* Amount Input (With prefix symbol inside) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                  <DollarSign size={10} />
                  Amount
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-zinc-500">$</span>
                  <input
                    type="text"
                    value={v2Amount}
                    onChange={(e) => setV2Amount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg pl-6 pr-3 py-2 text-xs placeholder-zinc-700 focus:outline-none focus:border-zinc-700 font-semibold transition-all duration-200"
                  />
                </div>
              </div>

              {/* Description Input (Takes full span) */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                  <FileText size={10} />
                  Description
                </label>
                <input
                  type="text"
                  value={v2Description}
                  onChange={(e) => setV2Description(e.target.value)}
                  placeholder="Optional memo details..."
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-all duration-200"
                />
              </div>

              {/* Date Selector (pejay-ui DatePicker) */}
              <div className="col-span-2 md:col-span-1 flex flex-col">
                <DatePicker
                  label="Date"
                  value={v2Date}
                  onChange={(d) => setV2Date(d)}
                />
              </div>

              {/* Primary Category Selector (Single Tag selection) */}
              <div className="col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                  <Tag size={10} />
                  Category Tag (Select One)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {v2TagsList.map((tag) => {
                    const isSelected = v2SelectedTag === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => setV2SelectedTag(isSelected ? null : tag)}
                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-all duration-200 ${
                          isSelected
                            ? v2Type === "expense"
                              ? "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                              : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                            : "bg-zinc-950/40 border-zinc-850 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="button"
              className={`w-full mt-2 py-3 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 select-none active:scale-[0.99] ${
                v2Type === "expense"
                  ? "bg-gradient-to-r from-amber-500 to-red-500 text-zinc-950 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              }`}
            >
              <PlusCircle size={14} />
              Add Transaction
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: FORM VERSION 3 (Optimized Compact with Inline Calendar) */}
      {/* ======================================================== */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-bold text-amber-400">
            Version 3.0 (Inline Calendar Grid)
          </span>
          <h2 className="text-lg font-bold text-zinc-300">Modern 2-Column Ledger with Inline Calendar</h2>
        </div>

        <div className="w-full max-w-lg bg-zinc-900/30 border border-zinc-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
          {/* Subtle accent line on top that matches form type */}
          <div
            className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 ${
              v3Type === "expense"
                ? "bg-gradient-to-r from-amber-500 to-red-500"
                : "bg-gradient-to-r from-emerald-500 to-teal-500"
            }`}
          />

          <div className="relative z-10 flex flex-col gap-5">
            {/* Header with Type selector and Reset button */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex p-0.5 bg-zinc-950/80 border border-zinc-800/50 rounded-lg">
                <button
                  onClick={() => {
                    setV3Type("expense");
                    setV3SelectedTag(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                    v3Type === "expense"
                      ? "bg-amber-500/10 text-amber-400 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Expense
                </button>
                <button
                  onClick={() => {
                    setV3Type("income");
                    setV3SelectedTag(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                    v3Type === "income"
                      ? "bg-emerald-500/10 text-emerald-400 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Income
                </button>
              </div>

              <button
                onClick={handleV3Reset}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
              >
                <RefreshCw size={12} />
                Reset Form
              </button>
            </div>

            {/* Form Fields: Two-Column Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Title Input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                  <Heading size={10} />
                  Title
                </label>
                <input
                  type="text"
                  value={v3Title}
                  onChange={(e) => setV3Title(e.target.value)}
                  placeholder={v3Type === "expense" ? "Grocery, Rent..." : "Salary, Bonus..."}
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-all duration-200"
                />
              </div>

              {/* Amount Input (With prefix symbol inside) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                  <DollarSign size={10} />
                  Amount
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-zinc-500">$</span>
                  <input
                    type="text"
                    value={v3Amount}
                    onChange={(e) => setV3Amount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg pl-6 pr-3 py-2 text-xs placeholder-zinc-700 focus:outline-none focus:border-zinc-700 font-semibold transition-all duration-200"
                  />
                </div>
              </div>

              {/* Description Input (Takes full span) */}
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                  <FileText size={10} />
                  Description
                </label>
                <input
                  type="text"
                  value={v3Description}
                  onChange={(e) => setV3Description(e.target.value)}
                  placeholder="Optional memo details..."
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-all duration-200"
                />
              </div>

              {/* Inline Calendar Grid (Takes full width, compact max-w-[340px]) */}
              <div className="col-span-2 flex flex-col gap-3 p-3 w-full mx-auto bg-zinc-950/40 border border-zinc-800/80 rounded-xl relative">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      setV3Date(today);
                      setV3ViewMonth(today.getMonth());
                      setV3ViewYear(today.getFullYear());
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors duration-200 flex items-center gap-1.5 px-2 py-1 bg-zinc-900/60 border border-zinc-800/40 rounded-md hover:border-zinc-700"
                  >
                    <Calendar size={10} />
                    Select Today
                  </button>

                  {/* Month and Year Dropdowns */}
                  <div className="flex gap-2">
                    {/* Month Select */}
                    <select
                      value={v3ViewMonth}
                      onChange={(e) => setV3ViewMonth(Number(e.target.value))}
                      className="bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300 rounded px-2 py-1 focus:outline-none cursor-pointer"
                    >
                      {v3Months.map((m, idx) => (
                        <option key={m} value={idx}>{m}</option>
                      ))}
                    </select>

                    {/* Year Select */}
                    <select
                      value={v3ViewYear}
                      onChange={(e) => setV3ViewYear(Number(e.target.value))}
                      className="bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300 rounded px-2 py-1 focus:outline-none cursor-pointer"
                    >
                      {v3Years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 text-center gap-1.5 mt-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <span key={day} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      {day}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5 text-center content-start">
                  {getCalendarDays().map((d, idx) => {
                    const isSelected =
                      v3Date.getDate() === d.day &&
                      v3Date.getMonth() === d.month &&
                      v3Date.getFullYear() === d.year;

                    const isToday =
                      d.day === new Date().getDate() &&
                      d.month === new Date().getMonth() &&
                      d.year === new Date().getFullYear();

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setV3Date(new Date(d.year, d.month, d.day))}
                        className={`w-full aspect-square flex items-center justify-center text-sm font-bold rounded-lg transition-all duration-200 ${
                          isSelected
                            ? v3Type === "expense"
                              ? "bg-amber-400 text-zinc-950"
                              : "bg-emerald-400 text-zinc-950"
                            : isToday && d.isCurrentMonth
                              ? v3Type === "expense"
                                ? "text-amber-400 font-extrabold hover:bg-zinc-800/60"
                                : "text-emerald-400 font-extrabold hover:bg-zinc-800/60"
                            : d.isCurrentMonth
                              ? "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                              : "text-zinc-700 opacity-30"
                        }`}
                      >
                        {d.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Category Selector (Single Tag selection) */}
              <div className="col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                  <Tag size={10} />
                  Category Tag (Select One)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {v3TagsList.map((tag) => {
                    const isSelected = v3SelectedTag === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => setV3SelectedTag(isSelected ? null : tag)}
                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-all duration-200 ${
                          isSelected
                            ? v3Type === "expense"
                              ? "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                              : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                            : "bg-zinc-950/40 border-zinc-850 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="button"
              className={`w-full mt-2 py-3 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 select-none active:scale-[0.99] ${
                v3Type === "expense"
                  ? "bg-gradient-to-r from-amber-500 to-red-500 text-zinc-950 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              }`}
            >
              <PlusCircle size={14} />
              Add Transaction
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: FORM VERSION 4 (Copy of V3 with inline calendar) */}
      {/* ======================================================== */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-bold text-teal-400">
            Version 4.0 (Full Calendar Copy)
          </span>
          <h2 className="text-lg font-bold text-zinc-300">Modern Ledger with Inline Calendar (Duplicate View)</h2>
        </div>

        <div className="w-full max-w-3xl bg-zinc-900/30 border border-zinc-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
          {/* Subtle accent line on top that matches form type */}
          <div
            className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 ${
              v4Type === "expense"
                ? "bg-gradient-to-r from-amber-500 to-red-500"
                : "bg-gradient-to-r from-emerald-500 to-teal-500"
            }`}
          />

          <div className="relative z-10 flex flex-col gap-5">
            {/* Header with Type selector and Reset button */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex p-0.5 bg-zinc-950/80 border border-zinc-800/50 rounded-lg">
                <button
                  onClick={() => {
                    setV4Type("expense");
                    setV4SelectedTag(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                    v4Type === "expense"
                      ? "bg-amber-500/10 text-amber-400 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Expense
                </button>
                <button
                  onClick={() => {
                    setV4Type("income");
                    setV4SelectedTag(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                    v4Type === "income"
                      ? "bg-emerald-500/10 text-emerald-400 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Income
                </button>
              </div>

              <button
                onClick={handleV4Reset}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
              >
                <RefreshCw size={12} />
                Reset Form
              </button>
            </div>

            {/* Form Fields: Side-by-Side 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-stretch divide-y md:divide-y-0 md:divide-x divide-zinc-800/40">
              {/* Left Column: Input Fields + Submit Button */}
              <div className="flex flex-col gap-4 md:pr-6">
                {/* Title Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Heading size={10} />
                    Title
                  </label>
                  <input
                    type="text"
                    value={v4Title}
                    onChange={(e) => setV4Title(e.target.value)}
                    placeholder={v4Type === "expense" ? "Grocery, Rent..." : "Salary, Bonus..."}
                    className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-all duration-200"
                  />
                </div>

                {/* Amount Input (With prefix symbol inside) */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <DollarSign size={10} />
                    Amount
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-zinc-500">$</span>
                    <input
                      type="text"
                      value={v4Amount}
                      onChange={(e) => setV4Amount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg pl-6 pr-3 py-2 text-xs placeholder-zinc-700 focus:outline-none focus:border-zinc-700 font-semibold transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Description Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <FileText size={10} />
                    Description
                  </label>
                  <input
                    type="text"
                    value={v4Description}
                    onChange={(e) => setV4Description(e.target.value)}
                    placeholder="Optional memo details..."
                    className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition-all duration-200"
                  />
                </div>

                {/* Primary Category Selector (Single Tag selection) */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <Tag size={10} />
                    Category Tag (Select One)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {v4TagsList.map((tag) => {
                      const isSelected = v4SelectedTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setV4SelectedTag(isSelected ? null : tag)}
                          className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-all duration-200 ${
                            isSelected
                              ? v4Type === "expense"
                                ? "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                                : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                              : "bg-zinc-950/40 border-zinc-850 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action Button (Placed on left column) */}
                <button
                  type="button"
                  className={`w-full mt-2 py-3 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 select-none active:scale-[0.99] ${
                    v4Type === "expense"
                      ? "bg-gradient-to-r from-amber-500 to-red-500 text-zinc-950 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  }`}
                >
                  <PlusCircle size={14} />
                  Add Transaction
                </button>
              </div>

              {/* Right Column: Calendar Grid */}
              <div className="flex flex-col gap-4 w-full h-full justify-between pt-6 md:pt-0">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      setV4Date(today);
                      setV4ViewMonth(today.getMonth());
                      setV4ViewYear(today.getFullYear());
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors duration-200 flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/60 border border-zinc-800/40 rounded-md hover:border-zinc-700 h-[28px]"
                  >
                    <Calendar size={10} />
                    Set Today
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Month Select */}
                    <select
                      value={v4ViewMonth}
                      onChange={(e) => setV4ViewMonth(Number(e.target.value))}
                      className="bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300 rounded px-2 py-0.5 focus:outline-none cursor-pointer h-[28px]"
                    >
                      {v3Months.map((m, idx) => (
                        <option key={m} value={idx}>{m}</option>
                      ))}
                    </select>

                    {/* Year Select */}
                    <select
                      value={v4ViewYear}
                      onChange={(e) => setV4ViewYear(Number(e.target.value))}
                      className="bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300 rounded px-2 py-0.5 focus:outline-none cursor-pointer h-[28px]"
                    >
                      {v3Years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 text-center gap-1.5 mt-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <span key={day} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      {day}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5 text-center content-start">
                  {getV4CalendarDays().map((d, idx) => {
                    const isSelected =
                      v4Date.getDate() === d.day &&
                      v4Date.getMonth() === d.month &&
                      v4Date.getFullYear() === d.year;

                    const isToday =
                      d.day === new Date().getDate() &&
                      d.month === new Date().getMonth() &&
                      d.year === new Date().getFullYear();

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setV4Date(new Date(d.year, d.month, d.day))}
                        className={`w-full aspect-square flex items-center justify-center text-sm font-bold rounded-lg transition-all duration-200 ${
                          isSelected
                            ? v4Type === "expense"
                              ? "bg-amber-400 text-zinc-950"
                              : "bg-emerald-400 text-zinc-950"
                            : isToday && d.isCurrentMonth
                              ? v4Type === "expense"
                                ? "text-amber-400 font-extrabold hover:bg-zinc-800/60"
                                : "text-emerald-400 font-extrabold hover:bg-zinc-800/60"
                            : d.isCurrentMonth
                              ? "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                              : "text-zinc-700 opacity-30"
                        }`}
                      >
                        {d.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: DEMO WIDGETS AND COMPONENTS                     */}
      {/* ======================================================== */}
      <div className="flex flex-col gap-6 mt-10">
        <h2 className="text-xl font-bold text-zinc-300 border-b border-zinc-800 pb-2">UI Component Demos</h2>
        
        <div className="flex flex-col min-w-80 max-w-80 gap-2">
          <div className="flex flex-col bg-[#4397ff] rounded-full py-2.5 px-4 ">
            <div className="flex gap-2 items-center">
              <div className="flex flex-1 text-[24px]">some text</div>
              <div className="p-1.5 border border-white rounded-full">
                <MoveDown size={16} strokeWidth={3} />
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-[#0a3c7a] rounded-2xl p-5 ">
            <div className="flex gap-2 justify-between items-center">
              <div className="size-10 bg-white rounded-full" />
              <div className="text-md font-medium border rounded-full px-3 py-0.5">
                $200
              </div>
            </div>
            <div className="flex text-[24px]">Title Text</div>
            <div className="flex text-sm text-zinc-400">
              some description text
            </div>
          </div>
        </div>

        <div className="flex rounded-2xl bg-[#212121] p-5 w-max border border-zinc-800/40 select-none shadow-lg gap-5">
          <div className="flex flex-col">
            <div className="flex justify-between text-sm mb-2.5">
              <div>
                <span>{format(new Date(), "MMM / yyyy")}</span>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((item) => (
                      <div
                        key={item}
                        className="size-4 rounded-full border-3 border-[#212121] bg-white shadow-md"
                      />
                    ))}
                  </div>
                  +100
                </div>
              </div>
            </div>
            <div className="flex">
              {/* Left Day Names Column */}
              <div className="flex flex-col gap-1 justify-between pr-3 py-0.5 text-white font-medium">
                {weekdays.map((day) => (
                  <span
                    key={day}
                    className="text-[12px] h-5 flex items-center leading-none"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Heatmap Grid Weeks */}
              <div className="flex gap-1.5 py-0.5">
                {heatmapWeeks.map((week, wIndex) => (
                  <div key={wIndex} className="flex flex-col gap-1">
                    {week.map((day: any, dIndex: any) => {
                      // If it is in the current month, style it as unfilled theme color, otherwise dark grey
                      const bgClass = day.isCurrentMonth
                        ? "bg-[#343434]"
                        : "bg-[#131313]";

                      return (
                        <div
                          key={dIndex}
                          title={`${day.date.toDateString()}`}
                          className={`w-9 h-5 rounded-sm ${bgClass} transition-transform duration-150 hover:scale-110 cursor-pointer ${
                            day.isToday ? "ring-1 ring-white/60" : ""
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between max-w-40">
            <span className="text-md">{format(new Date(), "EEEE")}</span>
            <div className="text-[80px] font-semibold">
              {format(new Date(), "d")}
            </div>
            <span className="border-l-4 border-amber-600 pl-2">
              some example text is here to write.
            </span>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl bg-[#212121] p-5 w-max border border-zinc-800/40 select-none shadow-lg">
          <div className="flex justify-between text-sm mb-2">
            <div>Current Month</div>
            <div>Total counts</div>
          </div>
          <div className="flex">
            {/* Left Day Names Column */}
            <div className="flex flex-col gap-1 justify-between pr-3 py-0.5 text-white font-medium">
              {weekdays.map((day) => (
                <span
                  key={day}
                  className="text-[12px] h-5 flex items-center leading-none"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Heatmap Grid Weeks */}
            <div className="flex gap-1.5 py-0.5">
              {heatmapWeeks.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-1">
                  {week.map((day: any, dIndex: any) => {
                    // If it is in the current month, style it as unfilled theme color, otherwise dark grey
                    const bgClass = day.isCurrentMonth
                      ? "bg-[#343434]"
                      : "bg-[#131313]";

                    return (
                      <div
                        key={dIndex}
                        title={`${day.date.toDateString()}`}
                        className={`w-9 h-5 rounded-sm ${bgClass} transition-transform duration-150 hover:scale-110 cursor-pointer ${
                          day.isToday ? "ring-1 ring-white/60" : ""
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl bg-zinc-800 p-5 max-w-md">
          {/* top bar */}
          <div className="flex w-full justify-between">
            <div>{selectedDemoOption.label}</div>
            <div>
              <SelectInput
                defaultValue={demoOptions[0].key}
                options={demoOptions}
                onChange={(_, option) => setSelectedDemoOption(option)}
              />
            </div>
          </div>
          {/* main content */}
          <div className="flex w-full">
            <span className="text-[58px] font-black ">$12,34,50,00</span>
          </div>
          {/* bottom bar */}
          <div className="flex w-full justify-between">
            <div></div>
            <div className="flex gap-1 items-center">
              <span>12%</span>
              <TrendingUp size={16} />
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl bg-zinc-800 p-5 max-w-md">
          {/* top bar */}
          <div className="flex w-full justify-between items-center">
            <div>{selectedDemoOption.label}</div>
            <div>
              <div className="flex gap-0.5 items-center bg-[#2d68ff] text-sm p-1 rounded-md">
                {demoOptions.map((op) => {
                  return (
                    <div
                      key={op.id}
                      onClick={() => setSelectedDemoOption(op)}
                      className={cn(
                        "rounded-sm hover:bg-[#252525] cursor-pointer px-2 py-1",
                        selectedDemoOption.id === op.id && "bg-[#252525]",
                      )}
                    >
                      {op.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* main content */}
          <div className="flex w-full">
            <span className="text-[58px] font-black ">$12,34,50,00</span>
          </div>
          {/* bottom bar */}
          <div className="flex w-full justify-between">
            <div></div>
            <div className="flex gap-1 items-center">
              <span>12%</span>
              <TrendingUp size={16} />
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-[#3d35e6] max-w-md overflow-hidden rounded-3xl">
          <div className="flex flex-col w-full rounded-3xl p-5 bg-zinc-800 text-white h-40">
            {/* top bar */}
            <div className="flex w-full justify-between">
              <div>{selectedDemoOption.label}</div>
              <div>
                <SelectInput
                  defaultValue={demoOptions[0].key}
                  options={demoOptions}
                  onChange={(_, option) => setSelectedDemoOption(option)}
                />
              </div>
            </div>
            {/* main content */}
            <div className="flex w-full">
              <span className="text-[58px] font-black ">$12,34,50,00</span>
            </div>
          </div>
          <div>
            <div className="flex w-full px-5 py-2.5">
              <div className="flex gap-1 items-center">
                <span>12%</span>
                <TrendingUp size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-[#3d35e6] max-w-md overflow-hidden rounded-3xl">
          <div className="flex flex-col w-full rounded-3xl p-5 bg-zinc-800 text-white h-40">
            {/* top bar */}
            <div className="flex w-full justify-between">
              <div>{selectedDemoOption.label}</div>
              <div>
                <SelectInput
                  defaultValue={demoOptions[0].key}
                  options={demoOptions}
                  onChange={(_, option) => setSelectedDemoOption(option)}
                />
              </div>
            </div>
            {/* main content */}
            <div className="flex w-full">
              <span className="text-[58px] font-black ">$12,34,50,00</span>
            </div>
          </div>
          <div>
            <div className="flex w-full px-5 py-2">
              <div className="flex gap-2 text-sm bg-amber-700 p-1.5 px-2.5 rounded-2xl items-center">
                <span>Some Text is Here</span>
                <TrendingUp size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col rounded-3xl bg-zinc-800 p-5 max-w-md pb-8">
            {/* top bar */}
            <div className="flex w-full justify-between">
              <div>left-text</div>
              <div>right-text</div>
            </div>
            {/* main content */}
            <div className="flex w-full">
              <span className="text-[58px] font-black ">$12,34,50,00</span>
            </div>
          </div>
          <div className="flex flex-col rounded-3xl bg-indigo-700 p-5 max-w-md -mt-3 pb-8">
            {/* top bar */}
            <div className="flex w-full justify-between">
              <div>left-text</div>
              <div>right-text</div>
            </div>
            {/* main content */}
            <div className="flex w-full">
              <span className="text-[58px] font-black ">$12,34,50,00</span>
            </div>
          </div>
          <div className="flex flex-col rounded-3xl bg-amber-700 p-5 max-w-md -mt-3">
            {/* top bar */}
            <div className="flex w-full justify-between">
              <div>left-text</div>
              <div>right-text</div>
            </div>
            {/* main content */}
            <div className="flex w-full">
              <span className="text-[58px] font-black ">$12,34,50,00</span>
            </div>
          </div>
        </div>

        {/* Standalone Concave Corner Card Demo */}
        <div className="flex flex-col items-center w-max">
          <div className="relative w-[320px] h-45">
            {/* Card background shape using SVG */}
            <svg
              className="absolute inset-0 w-full h-full drop-shadow-xl"
              viewBox="0 0 320 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 0 20 A 20 20 0 0 1 24 0 L 230 0 Q 260 0 260 30 A 30 30 0 0 0 290 60 Q 320 60 320 90 L 320 160 A 20 20 0 0 1 300 180 L 20 180 A 20 20 0 0 1 0 156 L 0 20 Z"
                fill="#1c1c1e"
              />
            </svg>

            {/* Card Content */}
            <div className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div className="flex items-center gap-2">
                <span className=" font-bold tracking-wider text-lg">lumin</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-zinc-400 text-[10px] tracking-widest uppercase">
                  Card Balance
                </span>
                <span className="text-2xl font-bold tracking-tight">
                  $78,122.00
                </span>
              </div>
            </div>

            {/* Corner Icon Button (Notch Control) */}
            <button className="absolute top-0 right-0 w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700/50 hover:bg-zinc-700 hover:border-zinc-600 transition-colors flex items-center justify-center text-white z-20 shadow-lg cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="2" y1="14" x2="6" y2="14" />
                <line x1="10" y1="8" x2="14" y2="8" />
                <line x1="18" y1="16" x2="22" y2="16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Overlapping Solid Filled Circles Demo */}
        <div className="flex flex-col items-center justify-center p-8 bg-[#1a1a1a] rounded-3xl max-w-md w-full">
          <div className="flex -space-x-8">
            <div className="w-14 h-14 rounded-full border-5 border-[#1a1a1a] bg-white shadow-md" />
            <div className="w-14 h-14 rounded-full border-5 border-[#1a1a1a] bg-white shadow-md" />
            <div className="w-14 h-14 rounded-full border-5 border-[#1a1a1a] bg-white shadow-md" />
            <div className="w-14 h-14 rounded-full border-5 border-[#1a1a1a] bg-white shadow-md" />
          </div>
        </div>
      </div>
    </Flex>
  );
};
