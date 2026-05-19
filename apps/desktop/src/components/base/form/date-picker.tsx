import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { format as formatDate, isValid, parse } from "date-fns";
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

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  variant?: "rounded" | "curved" | "square";
  isFloating?: boolean;
  labelPlacement?: "top" | "left" | "right";
  labelWidth?: string;
  "labelAlign-X"?: "left" | "center" | "right";
  "labelAlign-Y"?: "top" | "middle" | "bottom";
  minDate?: Date;
  maxDate?: Date;
  isTypeable?: boolean;
  showTodayButton?: boolean;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = ({
  value,
  onChange,
  label,
  description,
  error,
  placeholder = "Select Date",
  variant = "curved",
  isFloating = false,
  labelPlacement = "top",
  labelWidth = "w-32",
  "labelAlign-X": labelAlignX,
  "labelAlign-Y": labelAlignY = "middle",
  minDate,
  maxDate,
  isTypeable = true,
  showTodayButton = true,
  disabled = false,
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [internalHasContent, setInternalHasContent] = useState(!!value);
  const [leftElementWidth, setLeftElementWidth] = useState(0);
  const leftElementRef = useRef<HTMLDivElement>(null);

  const isActive = isFocused || !!value || internalHasContent;

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
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      const isSelected = value && formatDate(date, "yyyy-MM-dd") === formatDate(value, "yyyy-MM-dd");
      const isToday = formatDate(date, "yyyy-MM-dd") === formatDate(new Date(), "yyyy-MM-dd");

      days.push(
        <button
          key={d}
          onClick={() => { onChange?.(date); setIsOpen(false); }}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg text-[12px] font-medium transition-all relative",
            isSelected ? "bg-white text-black shadow-lg z-10 scale-110" : "hover:bg-gray-800 text-white",
            isToday && !isSelected && "border border-sky-500 text-sky-500"
          )}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const [currentMonth, setCurrentMonth] = useState(value || new Date());

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
          
          <input
            readOnly={!isTypeable}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFloating && !isActive ? "" : placeholder}
            value={value ? formatDate(value, "dd MMM yyyy") : ""}
            className="flex-1 bg-transparent border-none text-md text-white outline-none h-full py-2.5 pl-2 pr-2"
          />

          {value && (
            <button onClick={(e) => { e.stopPropagation(); onChange?.(undefined); }} className="pr-2.25 pl-2 hover:text-white text-gray-500 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="z-[9999] bg-black border border-gray-800 rounded-3xl shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="w-[260px]">
                <div className="flex items-center justify-between mb-6 px-1">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1.5 hover:bg-gray-800 rounded-lg text-white">
                    <ChevronLeft size={18} />
                  </button>
                  <h2 className="text-[12px] font-black uppercase tracking-tighter text-white">{formatDate(currentMonth, "MMMM yyyy")}</h2>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1.5 hover:bg-gray-800 rounded-lg text-white">
                    <ChevronRight size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} className="text-[10px] font-black uppercase text-gray-500 text-center py-2 tracking-widest">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar(currentMonth)}
                </div>
                {showTodayButton && (
                  <button onClick={() => { onChange?.(new Date()); setIsOpen(false); }} className="w-full mt-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-800 text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all">
                    Today
                  </button>
                )}
              </div>
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </div>
  );
};
