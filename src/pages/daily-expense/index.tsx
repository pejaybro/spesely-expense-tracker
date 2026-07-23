import { useState, useMemo } from "react";
import { SelectInput } from "../../pejay-ui/components";
import { cn } from "../../pejay-ui/utils/cn";
import {
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Heading,
  RefreshCw,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
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

const cardPeriods = ["Today", "Week", "Month", "Year"] as const;
type CardPeriod = typeof cardPeriods[number];

export const DailyExpense = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<CardPeriod>("Month");

  const periodMeta: Record<CardPeriod, { label: string; current: string; previous: string; delta: number; entries: number; avgDay: string; topTag: string }> = {
    Today:  { label: "vs Yesterday",  current: "$148.00",    previous: "$210.00",    delta: -29.5, entries: 6,   avgDay: "$148",  topTag: "Food"      },
    Week:   { label: "vs Last Week",  current: "$1,240.00",  previous: "$980.00",   delta: +26.5, entries: 22,  avgDay: "$177",  topTag: "Transport" },
    Month:  { label: "vs Last Month", current: "$4,820.00",  previous: "$5,310.00", delta: -9.2,  entries: 48,  avgDay: "$320",  topTag: "Rent"      },
    Year:   { label: "vs Last Year",  current: "$52,400.00", previous: "$47,900.00",delta: +9.4,  entries: 312, avgDay: "$144",  topTag: "Rent"      },
  };

  const meta = periodMeta[selectedPeriod];
  const isUp = meta.delta >= 0;

  // --- FORM VERSION 4 STATES ---
  const [v4Type, setV4Type] = useState<"expense" | "income">("expense");
  const [v4Title, setV4Title] = useState("");
  const [v4Description, setV4Description] = useState("");
  const [v4Amount, setV4Amount] = useState("");
  const [v4SelectedTag, setV4SelectedTag] = useState<string | null>(null);
  const [v4Date, setV4Date] = useState(new Date());
  const [v4ViewMonth, setV4ViewMonth] = useState(new Date().getMonth());
  const [v4ViewYear, setV4ViewYear] = useState(new Date().getFullYear());

  const v4TagsList =
    v4Type === "expense"
      ? ["Food", "Transport", "Rent", "Entertainment", "Utilities", "Travel"]
      : ["Salary", "Freelance", "Investment", "Gift", "Refund"];

  const v3Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const v3Years = Array.from(
    { length: 15 },
    (_, i) => new Date().getFullYear() - 7 + i,
  );

  const handleV4Reset = () => {
    setV4Title("");
    setV4Description("");
    setV4Amount("");
    setV4SelectedTag(null);
    const today = new Date();
    setV4Date(today);
    setV4ViewMonth(today.getMonth());
    setV4ViewYear(today.getFullYear());
  };

  const getV4CalendarDays = () => {
    const firstDayIndex = new Date(v4ViewYear, v4ViewMonth, 1).getDay();
    const adjustedIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(v4ViewYear, v4ViewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(v4ViewYear, v4ViewMonth, 0).getDate();

    const days: {
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
    }[] = [];
    for (let i = adjustedIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: v4ViewMonth === 0 ? 11 : v4ViewMonth - 1,
        year: v4ViewMonth === 0 ? v4ViewYear - 1 : v4ViewYear,
        isCurrentMonth: false,
      });
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        month: v4ViewMonth,
        year: v4ViewYear,
        isCurrentMonth: true,
      });
    }
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

  // --- HEATMAP STATES & WIDGET CALCULATIONS ---
  const heatmapWeeks = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

    const weeks: { date: Date; isCurrentMonth: boolean; isToday: boolean }[][] =
      [];
    for (let i = 0; i < allDays.length; i += 7) {
      const week = allDays.slice(i, i + 7).map(date => {
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

  return (
    <div className="flex flex-col w-full p-8 gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Expenses
        </h1>
        <p className="text-sm text-zinc-500">
          Manage your daily transactions and track active patterns.
        </p>
      </div>

      {/* Row 1: Form Version 4 Card */}
     <div className="flex flex-col gap-4 w-full">
      

        <div className="w-full bg-zinc-900 border border-zinc-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
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

        {/* Row 2: Cards Stack (Side-by-Side Row) */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch justify-start w-full max-w-4xl">
          {/* Card 1 — Total Expenses */}
          <div className="flex flex-col bg-amber-500 flex-1 min-w-[300px] rounded-3xl items-stretch">
            <div className="flex flex-col w-full rounded-2xl p-5 bg-zinc-900 text-white grow justify-between gap-4">
              {/* top bar */}
              <div className="flex w-full justify-between items-center gap-2">
                <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                  Total Expenses
                </div>
                <div className="flex gap-0.5 items-center bg-zinc-950/80 border border-zinc-800 text-[11px] p-0.5 rounded-lg">
                  {cardPeriods.map(period => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setSelectedPeriod(period)}
                      className={`rounded-md cursor-pointer px-2 py-0.5 text-[10px] font-semibold transition-all duration-200 ${
                        selectedPeriod === period
                          ? "bg-zinc-800 text-amber-400 font-bold"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mini stats row */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Entries</span>
                  <span className="text-sm font-black text-zinc-200">{meta.entries}</span>
                </div>
                <div className="w-px h-6 bg-zinc-800" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Avg / day</span>
                  <span className="text-sm font-black text-zinc-200">{meta.avgDay}</span>
                </div>
                <div className="w-px h-6 bg-zinc-800" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Top Tag</span>
                  <span className="text-sm font-black text-amber-400">{meta.topTag}</span>
                </div>
              </div>

              {/* main amount */}
              <div className="flex items-end">
                <span className="text-[40px] font-black leading-none tracking-tight text-white">
                  {meta.current}
                </span>
              </div>
            </div>
            <div className="flex w-full px-5 py-3.5 items-center justify-start shrink-0">
              <div className="flex gap-2 text-xs font-bold p-1.5 px-3 rounded-full items-center bg-white text-zinc-950">
                <span>{isUp ? "▲" : "▼"} {Math.abs(meta.delta)}% {meta.label}</span>
                <TrendingUp size={12} />
              </div>
            </div>
          </div>


          {/* Heatmap Widget */}
          <div className="flex rounded-2xl bg-zinc-900 border border-zinc-800/80 backdrop-blur-xl shadow-2xl p-5 flex-1 select-none gap-5 justify-between">
            <div className="flex flex-col">
              <div className="flex justify-between text-sm mb-2.5">
                <div>
                  <span className="font-semibold text-zinc-300">
                    {format(new Date(), "MMM / yyyy")}
                  </span>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map(item => (
                        <div
                          key={item}
                          className="w-4 h-4 rounded-full border-2 border-zinc-900 bg-zinc-700 shadow-md"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-zinc-400 ml-1.5 font-semibold">
                      +100
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex">
                {/* Left Day Names Column */}
                <div className="flex flex-col gap-1 justify-between pr-3 py-0.5 text-zinc-400 font-medium">
                  {weekdays.map(day => (
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
                        const bgClass = day.isCurrentMonth
                          ? "bg-zinc-800/80"
                          : "bg-zinc-950/40";

                        return (
                          <div
                            key={dIndex}
                            title={`${day.date.toDateString()}`}
                            className={`w-9 h-5 rounded-sm ${bgClass} transition-transform duration-150 hover:scale-110 cursor-pointer ${
                              day.isToday ? "ring-1 ring-amber-500" : ""
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between max-w-40 pl-3 border-l border-zinc-800/60">
              <span className="text-md text-zinc-400">
                {format(new Date(), "EEEE")}
              </span>
              <div className="text-[80px] font-black leading-none my-2 text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-500">
                {format(new Date(), "d")}
              </div>
              <span className="border-l-4 border-amber-500 pl-2 text-xs text-zinc-400">
                some example text is here to write.
              </span>
            </div>
          </div>
      </div>
    </div>
  );
};
