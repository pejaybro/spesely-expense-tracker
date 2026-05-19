import React, { useState, useRef, useLayoutEffect } from "react";
import { format as formatDate, subDays, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/src/utils";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";

type PresetKey = 
  | "today" | "yesterday" | "last-7-days" | "last-30-days" 
  | "this-month" | "last-month" | "this-year" | "last-3-months" | "last-6-months";

interface DateRangePickerProps {
  value?: { from: Date | undefined; to: Date | undefined };
  onChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  label?: string;
  description?: string;
  error?: string;
  presets?: PresetKey[];
  numberOfMonths?: number;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  variant?: "rounded" | "curved" | "square";
  isFloating?: boolean;
  labelPlacement?: "top" | "left" | "right";
  labelWidth?: string;
  "labelAlign-X"?: "left" | "center" | "right";
  "labelAlign-Y"?: "top" | "middle" | "bottom";
}

export const DateRangePicker = ({
  value,
  onChange,
  label,
  description,
  error,
  presets = [],
  numberOfMonths = 2,
  minDate,
  maxDate,
  disabled = false,
  className,
  variant = "curved",
  isFloating = false,
  labelPlacement = "top",
  labelWidth = "w-32",
  "labelAlign-X": labelAlignX,
  "labelAlign-Y": labelAlignY = "middle",
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value?.from || new Date());
  const [isFocused, setIsFocused] = useState(false);
  const [leftElementWidth, setLeftElementWidth] = useState(0);
  const leftElementRef = useRef<HTMLDivElement>(null);

  const hasValue = !!value?.from || !!value?.to;
  const isActive = isFocused || hasValue;

  useLayoutEffect(() => {
    if (leftElementRef.current) {
      setLeftElementWidth(leftElementRef.current.offsetWidth);
    }
  }, []);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const handleDateSelect = (date: Date) => {
    if (!value?.from || (value.from && value.to)) {
      onChange?.({ from: date, to: undefined });
    } else {
      if (date < value.from) onChange?.({ from: date, to: value.from });
      else onChange?.({ from: value.from, to: date });
    }
  };

  const applyPreset = (key: PresetKey) => {
    const today = new Date();
    let range: { from: Date; to: Date } | undefined;
    switch (key) {
      case "today": range = { from: today, to: today }; break;
      case "yesterday": { const y = subDays(today, 1); range = { from: y, to: y }; break; }
      case "last-7-days": range = { from: subDays(today, 6), to: today }; break;
      case "last-30-days": range = { from: subDays(today, 29), to: today }; break;
      case "this-month": range = { from: startOfMonth(today), to: endOfMonth(today) }; break;
      case "last-month": { const prev = subMonths(today, 1); range = { from: startOfMonth(prev), to: endOfMonth(prev) }; break; }
      case "this-year": range = { from: startOfYear(today), to: today }; break;
      case "last-3-months": range = { from: subMonths(today, 3), to: today }; break;
      case "last-6-months": range = { from: subMonths(today, 6), to: today }; break;
    }
    if (range) { onChange?.(range); setIsOpen(false); }
  };

  const isSideLabel = labelPlacement === "left" || labelPlacement === "right";
  const xAlignment = labelAlignX || (labelPlacement === "left" ? "left" : labelPlacement === "right" ? "right" : "left");
  const yAlignmentClass = labelAlignY === "top" ? "items-start" : labelAlignY === "bottom" ? "items-end" : "items-center";
  const radiusClass = variant === "square" ? "rounded-none" : variant === "curved" ? "rounded-lg" : "rounded-full";

  const renderCalendar = (month: Date) => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const daysInMonth = end.getDate();
    const startDay = start.getDay();
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      const isStart = value?.from && formatDate(date, "yyyy-MM-dd") === formatDate(value.from, "yyyy-MM-dd");
      const isEnd = value?.to && formatDate(date, "yyyy-MM-dd") === formatDate(value.to, "yyyy-MM-dd");
      const isInRange = value?.from && value?.to && date > value.from && date < value.to;
      days.push(
        <button key={d} onClick={() => handleDateSelect(date)} className={cn("w-9 h-9 flex items-center justify-center rounded-lg text-[12px] font-medium transition-all relative", (isStart || isEnd) ? "bg-white text-black shadow-lg z-10 scale-110" : "hover:bg-gray-800 text-white", isInRange && "bg-white/10 rounded-none", isStart && value?.to && "rounded-r-none", isEnd && value?.from && "rounded-l-none")}>
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className={cn("flex w-full", labelPlacement === "top" && "flex-col gap-1.5", labelPlacement === "left" && cn("flex-row gap-4", yAlignmentClass), labelPlacement === "right" && cn("flex-row-reverse gap-4", yAlignmentClass), className)}>
      {label && !isFloating && (
        <div className={cn("flex flex-col", isSideLabel ? "shrink-0" : "w-full", labelAlignY === "top" && isSideLabel && "mt-2.5")}>
          <div className={cn(isSideLabel ? labelWidth : "w-full", "flex flex-col", xAlignment === "left" && "items-start text-left", xAlignment === "right" && "items-end text-right", xAlignment === "center" && "items-center text-center")}>
            <span className="text-sm font-medium tracking-tight text-white">{label}</span>
            {description && <span className="text-xs text-gray-400 font-medium mt-0.5">{description}</span>}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col relative group" ref={refs.setReference} {...getReferenceProps()}>
        {label && isFloating && (
          <span
            className={cn(
              "absolute transition-all duration-200 pointer-events-none font-medium tracking-tight z-10 block truncate",
              isActive
                ? "-top-4 left-6 right-auto text-sm bg-black px-1.5 text-sky-500 max-w-[calc(100%-1.5rem)]"
                : "top-1/2 -translate-y-1/2 text-md text-gray-400 px-4 left-0 right-0",
            )}
            style={!isActive ? { paddingLeft: `${leftElementWidth}px` } : {}}
          >
            {label}
          </span>
        )}

        <div className={cn("flex items-center w-full bg-black border transition-all duration-200 h-10", radiusClass, isOpen || isFocused ? "border-sky-500 ring-4 ring-sky-500/10 shadow-lg" : "border-gray-800 hover:border-gray-600", error && "border-red-500 ring-4 ring-red-500/10")}>
          <div ref={leftElementRef} className="flex items-center pl-2.25 pr-2 text-gray-400 shrink-0">
            <CalendarIcon size={16} />
          </div>
          <div className="flex-1 truncate text-[11px] font-black tracking-widest flex items-center gap-2 text-white px-2">
            {value?.from ? formatDate(value.from, "dd MMM yyyy") : (isFloating ? "" : "Start")}
            <span className="text-gray-600">→</span>
            {value?.to ? formatDate(value.to, "dd MMM yyyy") : (isFloating ? "" : "End")}
          </div>
          {hasValue && (
            <button onClick={(e) => { e.stopPropagation(); onChange?.({ from: undefined, to: undefined }); }} className="pr-2.25 pl-2 hover:text-white text-gray-500 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="z-[9999] bg-black border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex animate-in fade-in zoom-in-95 duration-200">
              {presets.length > 0 && (
                <div className="w-[180px] border-r border-gray-900 bg-gray-900/50 p-4 flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-gray-600 mb-2 px-2 tracking-widest">Presets</span>
                  {presets.map(key => (
                    <button key={key} onClick={() => applyPreset(key)} className="text-left px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-tight text-gray-400 hover:bg-white hover:text-black transition-all">{key.replace(/-/g, " ")}</button>
                  ))}
                </div>
              )}
              <div className="p-6">
                <div className="flex gap-8">
                  {Array.from({ length: numberOfMonths }).map((_, i) => {
                    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + i);
                    return (
                      <div key={i} className="w-[260px]">
                        <div className="flex items-center justify-between mb-6 px-1">
                          {i === 0 ? (<button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-gray-800 rounded-lg text-white"><ChevronLeft size={18} /></button>) : <div className="w-8" />}
                          <h2 className="text-[12px] font-black uppercase tracking-tighter text-white">{formatDate(month, "MMMM yyyy")}</h2>
                          {i === numberOfMonths - 1 ? (<button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1.5 hover:bg-gray-800 rounded-lg text-white"><ChevronRight size={18} /></button>) : <div className="w-8" />}
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (<div key={d} className="text-[10px] font-black uppercase text-gray-500 text-center py-2 tracking-widest">{d}</div>))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">{renderCalendar(month)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </div>
  );
};
