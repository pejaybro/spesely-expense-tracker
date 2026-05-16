import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { cn } from "@/src/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import * as DateUtils from "@/root.config";
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

interface DatePickerProps {
  label?: string;
  description?: string;
  error?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  defaultToToday?: boolean;
  formatStr?: string;
  isTypeable?: boolean;
  typeableFormat?: "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd";
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

export const DatePicker = ({
  label,
  description,
  error: errorProp,
  value,
  onChange,
  minYear = 1900,
  maxYear = 2100,
  placeholder,
  defaultToToday = false,
  formatStr = "MMMM d, yyyy",
  isTypeable = false,
  typeableFormat = "dd/MM/yyyy",
  disableBefore,
  disableAfter,
  variant = "rounded",
  labelDirection = "label-top",
  labelWidth = "w-32",
  labelAlign,
  labelGap = "gap-1.5",
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(value || new Date());
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    isToday = (d: Date) => d.toDateString() === new Date().toDateString(),
  } = DateUtils as any;

  // Local helper functions to satisfy TS and missing exports
  const isValidDate = (d: any): d is Date => d instanceof Date && !isNaN(d.getTime());
  
  const parseDate = (str: string, fmt: string) => {
    try {
      const parts = str.split(fmt.includes("/") ? "/" : "-");
      if (parts.length !== 3) return new Date("invalid");
      
      let day, month, year;
      if (fmt.startsWith("dd")) { day = parts[0]; month = parts[1]; year = parts[2]; }
      else if (fmt.startsWith("MM")) { month = parts[0]; day = parts[1]; year = parts[2]; }
      else { year = parts[0]; month = parts[1]; day = parts[2]; }
      
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } catch (e) {
      return new Date("invalid");
    }
  };

  const isBeforeDate = (d1: Date, d2: Date) => d1.getTime() < d2.getTime();
  const isAfterDate = (d1: Date, d2: Date) => d1.getTime() > d2.getTime();

  const { refs, floatingStyles, context } = useFloating({
    open: !isTypeable && isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, { enabled: !isTypeable });
  const dismiss = useDismiss(context, { enabled: !isTypeable });
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  useEffect(() => {
    if (value && isTypeable && !isFocused) {
      setInputValue(format(value, typeableFormat));
      setInternalError(false);
    }
  }, [value, isTypeable, typeableFormat, isFocused, format]);

  const validatePart = (val: string, type: "day" | "month" | "year") => {
    const num = parseInt(val);
    if (isNaN(num)) return true;
    if (type === "month" && (num < 1 || num > 12)) return false;
    if (type === "day" && (num < 1 || num > 31)) return false;
    if (type === "year" && val.length === 4 && (num < minYear || num > maxYear)) return false;
    return true;
  };

  const isDateDisabled = (date: Date) => {
    if (disableBefore && (isBeforeDate(date, disableBefore) && !isSameDay(date, disableBefore))) return true;
    if (disableAfter && (isAfterDate(date, disableAfter) && !isSameDay(date, disableAfter))) return true;
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    const delimiter = typeableFormat.includes("/") ? "/" : "-";
    const isISO = typeableFormat.startsWith("yyyy");

    let masked = "";
    let hasError = false;

    if (isISO) {
      const year = digits.substring(0, 4);
      const month = digits.substring(4, 6);
      const day = digits.substring(6, 8);
      if (!validatePart(year, "year") || !validatePart(month, "month") || !validatePart(day, "day")) hasError = true;
      if (digits.length > 0) masked += year;
      if (digits.length >= 5) masked += delimiter + month;
      if (digits.length >= 7) masked += delimiter + day;
    } else {
      const first = digits.substring(0, 2);
      const second = digits.substring(2, 4);
      const year = digits.substring(4, 8);
      const isMDY = typeableFormat.startsWith("MM");
      if (!validatePart(first, isMDY ? "month" : "day")) hasError = true;
      if (!validatePart(second, isMDY ? "day" : "month")) hasError = true;
      if (!validatePart(year, "year")) hasError = true;
      if (digits.length > 0) masked += first;
      if (digits.length >= 3) masked += delimiter + second;
      if (digits.length >= 5) masked += delimiter + year;
    }
    
    setInputValue(masked.substring(0, 10));

    if (masked.length === 10) {
      try {
        const parsed = parseDate(masked, typeableFormat);
        if (isValidDate(parsed)) {
          if (isDateDisabled(parsed)) hasError = true;
          else onChange?.(parsed);
        } else {
          hasError = true;
        }
      } catch (e) {
        hasError = true;
      }
    }
    
    setInternalError(hasError);
  };

  const getFullMaskedValue = () => {
    if (!isFocused && !inputValue) return "";
    let current = inputValue;
    const template = typeableFormat.replace(/[a-zA-Z]/g, "_");
    let res = "";
    for (let i = 0; i < template.length; i++) {
      if (current[i]) res += current[i];
      else res += template[i];
    }
    return res;
  };

  const handleFocus = () => {
    setIsFocused(true);
    const pos = inputValue.length;
    setTimeout(() => {
      inputRef.current?.setSelectionRange(pos, pos);
    }, 0);
  };

  useLayoutEffect(() => {
    if (isFocused && inputRef.current) {
      const pos = inputValue.length;
      inputRef.current.setSelectionRange(pos, pos);
    }
  }, [inputValue, isFocused]);

  const calendarDays = useMemo(() => {
    try {
      const start = startOfWeek(startOfMonth(viewDate));
      const end = endOfWeek(endOfMonth(viewDate));
      return eachDayOfInterval({ start, end }) as Date[];
    } catch (e) {
      return [] as Date[];
    }
  }, [viewDate, startOfWeek, startOfMonth, endOfWeek, endOfMonth, eachDayOfInterval]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(viewDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1));
  };

  const isSideLabel = labelDirection.startsWith("label-left") || labelDirection.startsWith("label-right");
  const alignment = labelAlign || (
    labelDirection.includes("-left") ? "left" : 
    labelDirection.includes("-right") ? "right" : 
    labelDirection.includes("-center") ? "center" : "left"
  );

  const selectionRadius = variant === "rounded" || variant === "floating" ? "rounded-full" : variant === "curved" ? "rounded-lg" : "rounded-none";
  const borderRadius = variant === "rounded" || variant === "floating" ? "rounded-xl" : variant === "curved" ? "rounded-lg" : "rounded-none";

  const getDisplayText = () => {
    if (value) return format(value, formatStr);
    if (placeholder) return placeholder;
    if (defaultToToday) return format(new Date(), formatStr);
    return "";
  };

  const hasError = internalError || !!errorProp;
  const isFloating = variant === "floating";
  const isActive = isFocused || isOpen || !!value || (defaultToToday && !value);

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

        {isTypeable ? (
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={getFullMaskedValue()}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              placeholder={isFloating ? "" : typeableFormat.toLowerCase()}
              className={cn(
                "flex items-center w-full px-11 h-11 border-2 transition-all duration-300 bg-white dark:bg-black font-bold text-[13px] tracking-[0.2em] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600",
                borderRadius,
                isFocused ? "border-sky-500 ring-4 ring-sky-500/10 shadow-lg" : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600",
                hasError && "border-red-500 ring-4 ring-red-500/10 text-red-500"
              )}
            />
            <CalendarIcon size={14} strokeWidth={2.5} className={cn("absolute left-4 transition-colors", hasError ? "text-red-400" : "text-gray-400")} />
          </div>
        ) : (
          <button
            ref={refs.setReference}
            {...getReferenceProps()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "flex items-center gap-3 px-4 w-full h-11 border-2 transition-all duration-200 bg-white dark:bg-black font-semibold text-black dark:text-white uppercase tracking-tighter cursor-pointer",
              borderRadius,
              isOpen ? "border-black dark:border-white shadow-lg" : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600",
              errorProp && "border-red-500 hover:border-red-600"
            )}
          >
            <CalendarIcon size={14} strokeWidth={2.5} className="text-gray-400" />
            <span className={cn("text-[13px] flex-1 text-left", (!value && !defaultToToday) && "text-gray-400 font-medium")}>
              {(!isFloating || isActive) ? getDisplayText() : ""}
            </span>
            <ChevronDown size={14} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
          </button>
        )}

        {isOpen && !isTypeable && (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                className="z-9999 p-4 bg-white border border-gray-100 rounded-2xl shadow-2xl animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between mb-4 px-1">
                  <button onClick={(e) => { e.stopPropagation(); setViewDate(subMonths(viewDate, 1)); }} className="p-1 rounded hover:bg-gray-100 cursor-pointer text-black">
                    <ChevronLeft size={16} strokeWidth={2.5} />
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <select value={viewDate.getMonth()} onChange={handleMonthChange} className="appearance-none pl-2 pr-6 py-1 text-[12px] font-semibold tracking-tighter text-black bg-white border border-gray-100 rounded-md cursor-pointer hover:border-gray-300 transition-all focus:ring-0">
                        {months.map((m, i) => (<option key={m} value={i}>{m}</option>))}
                      </select>
                      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                    <div className="relative group">
                      <select value={viewDate.getFullYear()} onChange={handleYearChange} className="appearance-none pl-2 pr-6 py-1 text-[12px] font-semibold tracking-tighter text-black bg-white border border-gray-100 rounded-md cursor-pointer hover:border-gray-300 transition-all focus:ring-0">
                        {years.map(y => (<option key={y} value={y}>{y}</option>))}
                      </select>
                      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setViewDate(addMonths(viewDate, 1)); }} className="p-1 rounded hover:bg-gray-100 cursor-pointer text-black">
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-px mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} className="h-8 flex items-center justify-center text-[10px] font-semibold text-gray-400 uppercase">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                  {calendarDays.map((date: Date, i: number) => {
                    const isSelected = value && isSameDay(date, value);
                    const isOutside = format(date, "M") !== format(viewDate, "M");
                    const today = isToday(date);
                    const disabled = isDateDisabled(date);

                    return (
                      <div key={i} className="h-9 flex items-center justify-center">
                        <button
                          disabled={disabled}
                          onClick={() => { onChange?.(date); setIsOpen(false); }}
                          className={cn(
                            "w-8 h-8 text-[11px] font-semibold transition-all relative",
                            selectionRadius,
                            isSelected ? "bg-black text-white shadow-lg scale-110 z-10" : 
                            !isOutside ? "text-black hover:bg-gray-100" : "text-gray-200",
                            today && !isSelected && "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-sky-500 after:rounded-full",
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
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </div>
    </div>
  );
};
