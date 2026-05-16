import React, { useState, useMemo } from "react";
import { cn } from "@/src/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";
import * as DateUtils from "@/root.config";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

type StaticPresetId = 
  | "yesterday" | "today" | "tomorrow" 
  | "last-week" | "this-week" | "next-week" 
  | "last-month" | "this-month" | "next-month" 
  | "last-year" | "this-year" | "next-year";

type DynamicPresetId = 
  | `last-${number}-weeks` | `last-${number}-months` | `last-${number}-years`
  | `next-${number}-weeks` | `next-${number}-months` | `next-${number}-years`;

type PresetId = StaticPresetId | DynamicPresetId | string;

interface DateRangePickerProps {
  label?: string;
  description?: string;
  error?: string;
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  presets?: PresetId[];
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  defaultToToday?: boolean;
  formatStr?: string;
  disableBefore?: Date;
  disableAfter?: Date;
  variant?: "rounded" | "curved" | "square" | "floating";
  labelDirection?: 
    | "label-left" | "label-left-top" | "label-left-bottom"
    | "label-right" | "label-right-top" | "label-right-bottom"
    | "label-top" | "label-top-right" | "label-top-center";
  labelWidth?: string;
  labelAlign?: "left" | "center" | "right";
  labelGap?: string;
  className?: string;
}

export const DateRangePicker = ({
  label,
  description,
  error,
  value,
  onChange,
  presets: enabledPresets,
  minYear = 1900,
  maxYear = 2100,
  placeholder,
  defaultToToday = false,
  formatStr,
  disableBefore,
  disableAfter,
  variant = "rounded",
  labelDirection = "label-top",
  labelWidth = "w-32",
  labelAlign,
  labelGap = "gap-1.5",
  className,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange>(value || { from: undefined, to: undefined });
  const [hoverDate, setHoverDate] = useState<Date | undefined>(undefined);
  const [viewDate, setViewDate] = useState<Date>(range.from || new Date());
  const [activeBox, setActiveBox] = useState<"from" | "to">("from");
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  // Core Utilities from root.config
  const { 
    format = (d: Date) => d.toDateString(), 
    addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1),
    subMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() - n, 1),
    startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1),
    endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0),
    startOfWeek = (d: Date) => {
      const date = new Date(d);
      const day = date.getDay();
      const diff = date.getDate() - day;
      return new Date(date.setDate(diff));
    },
    endOfWeek = (d: Date) => {
      const date = new Date(d);
      const day = date.getDay();
      const diff = date.getDate() + (6 - day);
      return new Date(date.setDate(diff));
    },
    eachDayOfInterval = ({ start, end }: { start: Date; end: Date }) => {
      const days = [];
      let current = new Date(start);
      while (current <= end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return days;
    },
    isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString(),
    addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; },
    subDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() - n); return r; },
    startOfYear = (d: Date) => new Date(d.getFullYear(), 0, 1),
    endOfYear = (d: Date) => new Date(d.getFullYear(), 11, 31),
    addYears = (d: Date, n: number) => new Date(d.getFullYear() + n, d.getMonth(), d.getDate()),
    subYears = (d: Date, n: number) => new Date(d.getFullYear() - n, d.getMonth(), d.getDate())
  } = DateUtils as any;

  // Local helper functions for missing exports
  const isBeforeDate = (d1: Date, d2: Date) => d1.getTime() < d2.getTime();
  const isAfterDate = (d1: Date, d2: Date) => d1.getTime() > d2.getTime();

  const isDateDisabled = (date: Date) => {
    if (disableBefore && (isBeforeDate(date, disableBefore) && !isSameDay(date, disableBefore))) return true;
    if (disableAfter && (isAfterDate(date, disableAfter) && !isSameDay(date, disableAfter))) return true;
    return false;
  };

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10), 
      flip({ fallbackAxisSideDirection: 'start' }), 
      shift(),
      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(400, availableHeight - 20)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const calendarDays = useMemo(() => {
    try {
      const start = startOfWeek(startOfMonth(viewDate));
      const end = endOfWeek(endOfMonth(viewDate));
      return eachDayOfInterval({ start, end }) as Date[];
    } catch (e) {
      return [] as Date[];
    }
  }, [viewDate, startOfWeek, startOfMonth, endOfWeek, endOfMonth, eachDayOfInterval]);

  const allStaticPresets = [
    { id: "yesterday", label: "Yesterday", getValue: () => { const d = subDays(new Date(), 1); return { from: d, to: d }; } },
    { id: "today", label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
    { id: "tomorrow", label: "Tomorrow", getValue: () => { const d = addDays(new Date(), 1); return { from: d, to: d }; } },
    { id: "last-week", label: "Last Week", getValue: () => { const d = subDays(new Date(), 7); return { from: startOfWeek(d), to: endOfWeek(d) }; } },
    { id: "this-week", label: "This Week", getValue: () => ({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) }) },
    { id: "next-week", label: "Next Week", getValue: () => { const d = addDays(new Date(), 7); return { from: startOfWeek(d), to: endOfWeek(d) }; } },
    { id: "last-month", label: "Last Month", getValue: () => { const d = subMonths(new Date(), 1); return { from: startOfMonth(d), to: endOfMonth(d) }; } },
    { id: "this-month", label: "This Month", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
    { id: "next-month", label: "Next Month", getValue: () => { const d = addMonths(new Date(), 1); return { from: startOfMonth(d), to: endOfMonth(d) }; } },
    { id: "last-year", label: "Last Year", getValue: () => { const d = subYears(new Date(), 1); return { from: startOfYear(d), to: endOfYear(d) }; } },
    { id: "this-year", label: "This Year", getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
    { id: "next-year", label: "Next Year", getValue: () => { const d = addYears(new Date(), 1); return { from: startOfYear(d), to: endOfYear(d) }; } },
  ];

  const presets = useMemo(() => {
    if (!enabledPresets) return [];
    return enabledPresets.map(id => {
      const staticMatch = allStaticPresets.find(p => p.id === id);
      if (staticMatch) return staticMatch;
      const parts = id.split("-");
      if (parts.length === 3 && (parts[0] === "last" || parts[0] === "next")) {
        const isPast = parts[0] === "last";
        const val = parseInt(parts[1]);
        const unit = parts[2];
        const today = new Date();
        if (!isNaN(val)) {
          if (unit === "weeks") {
            const capped = Math.min(val, 52);
            return { 
              id, 
              label: `${isPast ? "Last" : "Next"} ${capped} Weeks`, 
              getValue: () => isPast 
                ? { from: subDays(today, capped * 7), to: today }
                : { from: today, to: addDays(today, capped * 7) }
            };
          }
          if (unit === "months") {
            const capped = Math.min(val, 12);
            return { 
              id, 
              label: `${isPast ? "Last" : "Next"} ${capped} Months`, 
              getValue: () => isPast 
                ? { from: subMonths(today, capped), to: today }
                : { from: today, to: addMonths(today, capped) }
            };
          }
          if (unit === "years") {
            const capped = Math.min(val, 10);
            return { 
              id, 
              label: `${isPast ? "Last" : "Next"} ${capped} Years`, 
              getValue: () => isPast 
                ? { from: subYears(today, capped), to: today }
                : { from: today, to: addYears(today, capped) }
            };
          }
        }
      }
      return null;
    }).filter(p => p !== null) as { id: string; label: string; getValue: () => DateRange }[];
  }, [enabledPresets]);

  const showSidebar = presets.length > 0;

  const isPresetActive = (p: { getValue: () => DateRange }) => {
    const pRange = p.getValue();
    if (!range.from || !pRange.from || !range.to || !pRange.to) return false;
    return isSameDay(range.from, pRange.from) && isSameDay(range.to, pRange.to);
  };

  const handleDateSelect = (date: Date) => {
    if (activeBox === "from") {
      setRange({ from: date, to: range.to && isAfterDate(date, range.to) ? undefined : range.to });
      setActiveBox("to");
    } else {
      if (range.from && isBeforeDate(date, range.from)) {
        setRange({ from: date, to: range.from });
      } else {
        setRange({ ...range, to: date });
      }
      setActiveBox("from");
    }
  };

  const handleBoxClick = (box: "from" | "to") => {
    setActiveBox(box);
    const dateToView = box === "from" ? range.from : range.to;
    if (dateToView) setViewDate(dateToView);
  };

  const isInRange = (date: Date) => {
    if (range.from && range.to) {
      const start = isBeforeDate(range.from, range.to) ? range.from : range.to;
      const end = isBeforeDate(range.from, range.to) ? range.to : range.from;
      return (isAfterDate(date, start) && isBeforeDate(date, end)) || isSameDay(date, start) || isSameDay(date, end);
    }
    if (range.from && hoverDate) {
      const start = isBeforeDate(hoverDate, range.from) ? hoverDate : range.from;
      const end = isBeforeDate(hoverDate, range.from) ? range.from : hoverDate;
      return (isAfterDate(date, start) && isBeforeDate(date, end)) || isSameDay(date, start) || isSameDay(date, end);
    }
    return false;
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(viewDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1));
  };

  const getDisplayText = () => {
    if (range.from) {
      if (range.to && isSameDay(range.from, range.to)) return format(range.from, formatStr || "MMMM d, yyyy");
      
      const isDiffYear = range.to && range.from.getFullYear() !== range.to.getFullYear();
      const shortF = formatStr || "MMM d";
      
      if (isDiffYear && range.to) {
        return `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`;
      }
      
      const yearF = formatStr ? "" : format(range.to || range.from, ", yyyy");
      return `${format(range.from, shortF)} - ${range.to ? format(range.to, shortF) : "..."}${yearF}`;
    }
    if (placeholder) return placeholder;
    if (defaultToToday) {
      const today = new Date();
      return `${format(today, "MMM d")} - ${format(today, "MMM d, yyyy")}`;
    }
    return "";
  };

  const isSideLabel = labelDirection.startsWith("label-left") || labelDirection.startsWith("label-right");
  const alignment = labelAlign || (
    labelDirection.includes("-left") ? "left" : 
    labelDirection.includes("-right") ? "right" : 
    labelDirection.includes("-center") ? "center" : "left"
  );

  const borderRadius = variant === "rounded" || variant === "floating" ? "rounded-xl" : variant === "curved" ? "rounded-lg" : "rounded-none";

  const isFloating = variant === "floating";
  const isActive = isFocused || isOpen || !!range.from;

  return (
    <div className={cn("flex w-full", labelGap, isSideLabel ? "flex-row" : "flex-col", className)}>
      {label && !isFloating && (
        <div className={cn("flex flex-col", isSideLabel ? "shrink-0" : "w-full", labelDirection.endsWith("-top") && isSideLabel && "mt-1.5")}>
          <div className={cn(
            isSideLabel ? labelWidth : "w-full", 
            "flex flex-col", 
            alignment === "left" && "items-start text-left", 
            alignment === "right" && "items-end text-right", 
            alignment === "center" && "items-center text-center"
          )}>
            <span className="text-sm font-semibold tracking-tight text-black dark:text-white uppercase">{label}</span>
            {description && <span className="text-[11px] text-gray-400 font-medium mt-0.5">{description}</span>}
          </div>
        </div>
      )}

      <div className="flex-1 relative group">
        {label && isFloating && (
          <span 
            className={cn(
              "absolute transition-all duration-200 pointer-events-none font-bold uppercase tracking-tight z-10 block truncate",
              isActive 
                ? "-top-2.5 left-3 right-auto text-[10px] bg-white dark:bg-black px-1.5 text-sky-500 max-w-[calc(100%-1.5rem)]" 
                : cn(
                    "top-1/2 -translate-y-1/2 text-[13px] text-gray-400",
                    "left-11 right-8"
                  )
            )}
          >
            {label}
          </span>
        )}

        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "flex items-center gap-3 px-4 h-11 border-2 transition-all duration-200 bg-white dark:bg-black font-semibold text-black dark:text-white uppercase tracking-tighter cursor-pointer",
            borderRadius,
            isOpen ? "border-black dark:border-white shadow-lg" : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600",
            error && "border-red-500 hover:border-red-600"
          )}
        >
          <CalendarIcon size={14} strokeWidth={2.5} className="text-gray-400" />
          <span className={cn("text-[13px] flex-1 text-left", (!range.from && !defaultToToday) && "text-gray-400 font-medium")}>
            {(range.from && (!isFloating || isActive)) ? getDisplayText() : (isFloating ? "" : (placeholder || ""))}
          </span>
          <ChevronDown size={14} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                className="z-9999 flex bg-white border border-gray-100 rounded-2xl shadow-2xl animate-in fade-in duration-150 max-w-[95vw] overflow-hidden"
              >
                {/* Sidebar Panel */}
                {showSidebar && isPanelVisible && (
                  <div className="w-44 shrink-0 border-r border-gray-100 bg-gray-50/50 flex flex-col min-h-0">
                    <div className="flex items-center justify-between p-4 pb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Presets</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-0 flex flex-col gap-1">
                      {presets.map((p) => {
                        const active = isPresetActive(p);
                        return (
                          <button
                            key={p.id}
                            onClick={() => { const r = p.getValue(); setRange(r); if (r.from) setViewDate(r.from); setActiveBox("from"); }}
                            className={cn(
                              "px-3 py-2 text-[12px] font-semibold text-left rounded-lg transition-all cursor-pointer truncate",
                              active 
                                ? "bg-sky-500 text-white shadow-md shadow-sky-100" 
                                : "text-gray-700 hover:bg-white hover:text-sky-500"
                            )}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div className={cn("flex flex-col min-w-[340px] flex-1 min-h-0")}>
                  <div className="flex items-center gap-2 p-4 pb-0">
                    {showSidebar && (
                      <button onClick={() => setIsPanelVisible(!isPanelVisible)} className="p-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 cursor-pointer transition-colors shrink-0">
                        {isPanelVisible ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
                      </button>
                    )}
                    <button onClick={() => handleBoxClick("from")} className={cn("flex-1 p-2.5 border transition-all rounded-xl text-center font-semibold text-[11px] cursor-pointer truncate", activeBox === "from" ? "border-sky-500 bg-sky-50 text-sky-600" : "border-gray-100 hover:border-gray-300")}>
                      {range.from ? format(range.from, formatStr || "MMM d, yyyy") : "START"}
                    </button>
                    <button onClick={() => handleBoxClick("to")} className={cn("flex-1 p-2.5 border transition-all rounded-xl text-center font-semibold text-[11px] cursor-pointer truncate", activeBox === "to" ? "border-sky-500 bg-sky-50 text-sky-600" : "border-gray-100 hover:border-gray-300")}>
                      {range.to ? format(range.to, formatStr || "MMM d, yyyy") : "END"}
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between p-4">
                      <button onClick={(e) => { e.stopPropagation(); setViewDate(subMonths(viewDate, 1)); }} className="p-1 rounded hover:bg-gray-100 cursor-pointer text-black">
                        <ChevronLeft size={16} strokeWidth={2.5} />
                      </button>
                      <div className="flex items-center gap-2">
                        <div className="relative group">
                          <select value={viewDate.getMonth()} onChange={handleMonthChange} className="appearance-none pl-2 pr-6 py-1 text-[11px] font-semibold tracking-tighter text-black bg-white border border-gray-100 rounded-md cursor-pointer hover:border-gray-300 transition-all focus:ring-0">
                            {months.map((m, i) => (<option key={m} value={i}>{m}</option>))}
                          </select>
                          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>
                        <div className="relative group">
                          <select value={viewDate.getFullYear()} onChange={handleYearChange} className="appearance-none pl-2 pr-6 py-1 text-[11px] font-semibold tracking-tighter text-black bg-white border border-gray-100 rounded-md cursor-pointer hover:border-gray-300 transition-all focus:ring-0">
                            {years.map(y => (<option key={y} value={y}>{y}</option>))}
                          </select>
                          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setViewDate(addMonths(viewDate, 1)); }} className="p-1 rounded hover:bg-gray-100 cursor-pointer text-black">
                        <ChevronRight size={16} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-7 gap-px mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                          <div key={d} className="h-8 flex items-center justify-center text-[10px] font-semibold text-gray-400 uppercase">{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-y-1">
                        {calendarDays.map((date: Date, i: number) => {
                          const active = isInRange(date);
                          const isStart = range.from && isSameDay(date, range.from);
                          const isEnd = range.to && isSameDay(date, range.to);
                          const isOutside = format(date, "M") !== format(viewDate, "M");
                          const disabled = isDateDisabled(date);

                          return (
                            <div key={i} className="h-9 relative flex items-center justify-center" onMouseEnter={() => !range.to && setHoverDate(date)} onMouseLeave={() => setHoverDate(undefined)}>
                              {active && !isOutside && (
                                <div className={cn("absolute inset-0 bg-sky-50 z-0", isStart && "rounded-l-full ml-1", isEnd && "rounded-r-full mr-1", !isStart && !isEnd && "mx-0")} />
                              )}
                              <button 
                                disabled={disabled}
                                onClick={() => handleDateSelect(date)} 
                                className={cn(
                                  "w-8 h-8 text-[11px] font-semibold relative z-10 transition-all rounded-full", 
                                  (isStart || isEnd) ? "bg-sky-500 text-white shadow-md scale-110" : !isOutside ? "text-black hover:bg-gray-100" : "text-gray-200",
                                  disabled ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
                                )}
                              >
                                {format(date, "d")}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 p-4 pt-0 flex items-center justify-end gap-3 bg-white z-50">
                    <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-[12px] font-semibold text-gray-500 hover:text-black cursor-pointer">Cancel</button>
                    <button onClick={() => { onChange?.(range); setIsOpen(false); }} className="px-8 py-2 bg-sky-500 text-white rounded-full text-[12px] font-semibold shadow-lg hover:shadow-sky-200 transition-all cursor-pointer">Apply</button>
                  </div>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </div>
    </div>
  );
};
