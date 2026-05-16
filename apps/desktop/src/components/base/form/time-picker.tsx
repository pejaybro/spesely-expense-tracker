import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { cn } from "@/src/utils";
import { Clock, ChevronDown } from "lucide-react";
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

interface TimePickerProps {
  label?: string;
  description?: string;
  error?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  hour12?: boolean;
  showSeconds?: boolean;
  isTypeable?: boolean;
  placeholder?: string;
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

export const TimePicker = ({
  label,
  description,
  error: errorProp,
  value,
  onChange,
  hour12 = true,
  showSeconds = false,
  isTypeable = false,
  placeholder,
  variant = "rounded",
  labelDirection = "label-top",
  labelWidth = "w-32",
  labelAlign,
  labelGap = "gap-1.5",
  className,
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Core Utilities from root.config
  const {
    format = (d: Date) => d.toLocaleTimeString(),
  } = DateUtils as any;

  // Local helper for validation
  const isValidDate = (d: any): d is Date => d instanceof Date && !isNaN(d.getTime());

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

  const timeFormat = useMemo(() => {
    let f = hour12 ? "hh:mm" : "HH:mm";
    if (showSeconds) f += ":ss";
    if (hour12) f += " aa";
    return f;
  }, [hour12, showSeconds]);

  useEffect(() => {
    if (value && isTypeable && !isFocused) {
      setInputValue(format(value, timeFormat));
    }
  }, [value, isTypeable, timeFormat, isFocused, format]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.toUpperCase();
    const isDeleting = rawVal.length < (getFullMaskedValue().length);
    
    // Extract numbers
    const digits = rawVal.replace(/\D/g, "");
    const hh = digits.substring(0, 2);
    const mm = digits.substring(2, 4);
    const ss = digits.substring(4, 6);

    let masked = "";
    let hasError = false;

    // Boundary checks
    if (hh && (parseInt(hh) > (hour12 ? 12 : 23) || (hour12 && parseInt(hh) === 0))) hasError = true;
    if (mm && parseInt(mm) > 59) hasError = true;
    if (ss && parseInt(ss) > 59) hasError = true;

    if (digits.length > 0) masked += hh;
    if (digits.length >= 3) masked += ":" + mm;
    if (showSeconds && digits.length >= 5) masked += ":" + ss;

    if (hour12) {
      let ampm = "";
      const lastA = rawVal.lastIndexOf("A");
      const lastP = rawVal.lastIndexOf("P");

      if (lastP > lastA) ampm = "PM";
      else if (lastA > lastP) ampm = "AM";
      
      if (isDeleting) {
        if (rawVal.endsWith("A")) ampm = "A";
        else if (rawVal.endsWith("P")) ampm = "P";
        else if (rawVal.endsWith(" ")) ampm = "";
        else if (digits.length <= (showSeconds ? 6 : 4) && !rawVal.includes("A") && !rawVal.includes("P")) ampm = "";
      }

      if (ampm) masked += " " + ampm;
    }

    const finalVal = masked.substring(0, timeFormat.length);
    setInputValue(finalVal);
    setInternalError(hasError);

    // Parse logic
    const isComplete = !hour12 
      ? finalVal.length === timeFormat.length 
      : (finalVal.endsWith("AM") || finalVal.endsWith("PM"));

    if (!hasError && isComplete) {
      try {
        const today = new Date();
        const parts = finalVal.split(" ");
        const timeParts = parts[0].split(":");
        let hour = parseInt(timeParts[0]);
        const minute = parseInt(timeParts[1]);
        const second = showSeconds ? parseInt(timeParts[2]) : 0;
        
        if (hour12) {
          if (parts[1] === "PM" && hour < 12) hour += 12;
          if (parts[1] === "AM" && hour === 12) hour = 0;
        }
        const newDate = new Date(today.setHours(hour, minute, second, 0));
        if (isValidDate(newDate)) onChange?.(newDate);
      } catch (e) {}
    }
  };

  const getFullMaskedValue = () => {
    if (!isFocused && !inputValue) return "";
    let current = inputValue;
    let template = hour12 ? "__:__" : "__:__";
    if (showSeconds) template += ":__";
    if (hour12) template += " __";

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
    setTimeout(() => inputRef.current?.setSelectionRange(pos, pos), 0);
  };

  useLayoutEffect(() => {
    if (isFocused && inputRef.current) {
      const pos = inputValue.length;
      inputRef.current.setSelectionRange(pos, pos);
    }
  }, [inputValue, isFocused]);

  const hours = Array.from({ length: hour12 ? 12 : 24 }, (_, i) => hour12 ? i + 1 : i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const secs = Array.from({ length: 60 }, (_, i) => i);

  const handleTimeSelect = (h: number, m: number, s: number, p?: string) => {
    const d = new Date(value || new Date());
    let hour = h;
    if (hour12) {
      const isPM = p === "PM";
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
    }
    d.setHours(hour, m, s, 0);
    onChange?.(d);
  };

  const currentHour = value ? (hour12 ? (value.getHours() % 12 || 12) : value.getHours()) : null;
  const currentMinute = value ? value.getMinutes() : null;
  const currentSecond = value ? value.getSeconds() : null;
  const currentPeriod = value ? (value.getHours() >= 12 ? "PM" : "AM") : "AM";

  const isSideLabel = labelDirection.startsWith("label-left") || labelDirection.startsWith("label-right");
  const alignment = labelAlign || (
    labelDirection.includes("-left") ? "left" : 
    labelDirection.includes("-right") ? "right" : 
    labelDirection.includes("-center") ? "center" : "left"
  );

  const borderRadius = variant === "rounded" || variant === "floating" ? "rounded-xl" : variant === "curved" ? "rounded-lg" : "rounded-none";

  const hasError = internalError || !!errorProp;
  const isFloating = variant === "floating";
  const isActive = isFocused || isOpen || !!value;

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
              placeholder={isFloating ? "" : timeFormat.toLowerCase()}
              className={cn(
                "flex items-center w-full px-11 h-11 border-2 transition-all duration-150 bg-white dark:bg-black font-bold text-[13px] tracking-[0.2em] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600",
                borderRadius,
                isFocused ? "border-sky-500 ring-4 ring-sky-500/10 shadow-lg" : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600",
                hasError && "border-red-500 ring-4 ring-red-500/10 text-red-500"
              )}
            />
            <Clock size={14} strokeWidth={2.5} className={cn("absolute left-4 transition-colors", hasError ? "text-red-400" : "text-gray-400")} />
          </div>
        ) : (
          <button
            ref={refs.setReference}
            {...getReferenceProps()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "flex items-center gap-3 px-4 w-full h-11 border-2 transition-all duration-150 bg-white dark:bg-black font-semibold text-black dark:text-white uppercase tracking-tighter cursor-pointer",
              borderRadius,
              isOpen ? "border-black dark:border-white shadow-lg" : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600",
              hasError && "border-red-500 hover:border-red-600"
            )}
          >
            <Clock size={14} strokeWidth={2.5} className="text-gray-400" />
            <span className={cn("text-[13px] flex-1 text-left", !value && "text-gray-400 font-medium")}>
              {(value && (!isFloating || isActive)) ? format(value, timeFormat) : (isFloating ? "" : (placeholder || "SELECT TIME"))}
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
                className="z-9999 bg-white border border-gray-100 rounded-2xl shadow-2xl animate-in fade-in duration-150 p-2 flex gap-1 h-[280px]"
              >
                {/* Hour Column */}
                <div className="flex flex-col overflow-y-auto custom-scrollbar px-1">
                   <div className="text-[10px] font-black text-gray-300 uppercase p-2 sticky top-0 bg-white">Hour</div>
                   {hours.map(h => (
                     <button
                       key={h}
                       onClick={() => handleTimeSelect(h, currentMinute || 0, currentSecond || 0, currentPeriod)}
                       className={cn(
                         "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all cursor-pointer",
                         currentHour === h ? "bg-black text-white shadow-lg" : "hover:bg-gray-100 text-black"
                       )}
                     >
                       {h.toString().padStart(2, "0")}
                     </button>
                   ))}
                </div>

                {/* Minute Column */}
                <div className="flex flex-col overflow-y-auto custom-scrollbar px-1 border-l border-gray-50">
                   <div className="text-[10px] font-black text-gray-300 uppercase p-2 sticky top-0 bg-white">Min</div>
                   {minutes.map(m => (
                     <button
                       key={m}
                       onClick={() => handleTimeSelect(currentHour || (hour12 ? 12 : 0), m, currentSecond || 0, currentPeriod)}
                       className={cn(
                         "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all cursor-pointer",
                         currentMinute === m ? "bg-black text-white shadow-lg" : "hover:bg-gray-100 text-black"
                       )}
                     >
                       {m.toString().padStart(2, "0")}
                     </button>
                   ))}
                </div>

                {/* Seconds Column */}
                {showSeconds && (
                  <div className="flex flex-col overflow-y-auto custom-scrollbar px-1 border-l border-gray-50">
                    <div className="text-[10px] font-black text-gray-300 uppercase p-2 sticky top-0 bg-white">Sec</div>
                    {secs.map(s => (
                      <button
                        key={s}
                        onClick={() => handleTimeSelect(currentHour || (hour12 ? 12 : 0), currentMinute || 0, s, currentPeriod)}
                        className={cn(
                          "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all cursor-pointer",
                          currentSecond === s ? "bg-black text-white shadow-lg" : "hover:bg-gray-100 text-black"
                        )}
                      >
                        {s.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                )}

                {/* AM/PM Column */}
                {hour12 && (
                  <div className="flex flex-col px-1 border-l border-gray-50">
                    <div className="text-[10px] font-black text-gray-300 uppercase p-2">Per</div>
                    {["AM", "PM"].map(p => (
                      <button
                        key={p}
                        onClick={() => handleTimeSelect(currentHour || 12, currentMinute || 0, currentSecond || 0, p)}
                        className={cn(
                          "w-12 h-10 shrink-0 flex items-center justify-center rounded-lg text-[11px] font-black transition-all cursor-pointer",
                          currentPeriod === p ? "bg-sky-500 text-white shadow-lg" : "hover:bg-gray-100 text-black"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </div>
    </div>
  );
};
