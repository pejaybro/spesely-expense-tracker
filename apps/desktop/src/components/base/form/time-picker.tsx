import React, { useState, useMemo, useRef, useEffect } from "react";
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
  value?: Date | null;
  onChange?: (date: Date) => void;
  timeFormat?: "12hr" | "24hr";
  showSeconds?: boolean;
  isTypeable?: boolean;
  placeholder?: string;
  variant?: "rounded" | "curved" | "square";
  isFloating?: boolean;
  labelPlacement?: "top" | "left" | "right";
  labelWidth?: string;
  "labelAlign-X"?: "left" | "center" | "right";
  "labelAlign-Y"?: "top" | "middle" | "bottom";
  className?: string;
}

export const TimePicker = ({
  label,
  description,
  error: errorProp,
  value,
  onChange,
  timeFormat = "12hr",
  showSeconds = false,
  isTypeable = false,
  placeholder,
  variant = "curved",
  isFloating = false,
  labelPlacement = "top",
  labelWidth = "w-32",
  "labelAlign-X": labelAlignX,
  "labelAlign-Y": labelAlignY = "middle",
  className,
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPos, setCursorPos] = useState<number | null>(null);

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

  const is12Hour = timeFormat === "12hr";

  const displayFormat = useMemo(() => {
    let f = is12Hour ? "hh:mm" : "HH:mm";
    if (showSeconds) f += ":ss";
    if (is12Hour) f += " aa";
    return f;
  }, [is12Hour, showSeconds]);

  useEffect(() => {
    if (value && isTypeable && !isFocused) {
      setInputValue(format(value, displayFormat));
    }
  }, [value, isTypeable, displayFormat, isFocused, format]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawVal = e.target.value.toUpperCase();
    let cPos = e.target.selectionStart || 0;
    let nativeEvent = e.nativeEvent as InputEvent;
    let isDeleting = nativeEvent.inputType === "deleteContentBackward";
    
    const rawBeforeCursor = rawVal.slice(0, cPos);
    const valueCharsBefore = (rawBeforeCursor.match(/[0-9AP]/g) || []).length;

    let digits = rawVal.replace(/\D/g, "");
    let oldDigits = inputValue.replace(/\D/g, "");

    const digitLimit = showSeconds ? 6 : 4;

    if (isDeleting && oldDigits.length === digits.length && digits.length > 0) {
      digits = digits.slice(0, -1);
      cPos--;
    }

    digits = digits.slice(0, digitLimit);

    let masked = "";
    let hasError = false;

    // Boundary checks
    const hh = digits.substring(0, 2);
    const mm = digits.substring(2, 4);
    const ss = digits.substring(4, 6);

    if (hh && (parseInt(hh) > (is12Hour ? 12 : 23) || (is12Hour && parseInt(hh) === 0))) hasError = true;
    if (mm && parseInt(mm) > 59) hasError = true;
    if (ss && parseInt(ss) > 59) hasError = true;

    if (digits.length > 0) masked += hh;
    if (digits.length >= 3) masked += ":" + mm;
    if (showSeconds && digits.length >= 5) masked += ":" + ss;

    if (is12Hour) {
      let ampm = "";
      const lastA = rawVal.lastIndexOf("A");
      const lastP = rawVal.lastIndexOf("P");

      if (lastP > lastA) ampm = "PM";
      else if (lastA > lastP) ampm = "AM";
      
      if (isDeleting) {
        if (rawVal.endsWith("A") || rawVal.endsWith("P")) {
          ampm = "";
        }
      }

      if (ampm) masked += " " + ampm;
    }

    const finalVal = masked.substring(0, displayFormat.length);

    let template = is12Hour ? "__:__ __" : "__:__";
    if (showSeconds && !is12Hour) template = "__:__:__";
    if (showSeconds && is12Hour) template = "__:__:__ __";
    
    let fullMask = "";
    for (let i = 0; i < template.length; i++) {
      if (finalVal[i]) fullMask += finalVal[i];
      else fullMask += template[i];
    }

    let newCPos = 0;
    let count = 0;
    for (let i = 0; i < fullMask.length; i++) {
      if (/[0-9AP]/.test(fullMask[i])) count++;
      if (count === valueCharsBefore) {
        newCPos = i + 1;
        break;
      }
    }
    if (valueCharsBefore === 0) newCPos = 0;
    else if (count < valueCharsBefore) newCPos = fullMask.length;

    if (!isDeleting) {
      while (fullMask[newCPos] && /[^0-9A-P_]/.test(fullMask[newCPos])) {
        if (fullMask[newCPos] === " " && fullMask[newCPos + 1] === "_") break;
        newCPos++;
      }
    } else {
      while (newCPos > 0 && fullMask[newCPos - 1] && /[^0-9A-P]/.test(fullMask[newCPos - 1])) {
        newCPos--;
      }
    }

    setCursorPos(newCPos);
    setInputValue(finalVal);
    setInternalError(hasError);

    // Parse logic
    const isComplete = !is12Hour 
      ? finalVal.length === displayFormat.length 
      : (finalVal.endsWith("AM") || finalVal.endsWith("PM"));

    if (!hasError && isComplete) {
      try {
        const today = new Date();
        const parts = finalVal.split(" ");
        const timeParts = parts[0].split(":");
        let hour = parseInt(timeParts[0]);
        const minute = parseInt(timeParts[1]);
        const second = showSeconds ? parseInt(timeParts[2]) : 0;
        
        if (is12Hour) {
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
    if (!isFocused && inputValue) return inputValue;
    
    let current = inputValue;

    let template = is12Hour ? "__:__ __" : "__:__";
    if (showSeconds && !is12Hour) template = "__:__:__";
    if (showSeconds && is12Hour) template = "__:__:__ __";
    
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return;
    if (!/[0-9A-P: ]/.test(e.key.toUpperCase())) {
      e.preventDefault();
    }
  };

  React.useLayoutEffect(() => {
    if (isFocused && inputRef.current && cursorPos !== null) {
      inputRef.current.setSelectionRange(cursorPos, cursorPos);
    }
  }, [inputValue, isFocused, cursorPos]);

  const hours = Array.from({ length: is12Hour ? 12 : 24 }, (_, i) => is12Hour ? i + 1 : i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const secs = Array.from({ length: 60 }, (_, i) => i);

  const handleTimeSelect = (h: number, m: number, s: number, p?: string) => {
    const d = new Date(value || new Date());
    let hour = h;
    if (is12Hour) {
      const isPM = p === "PM";
      if (isPM && hour < 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
    }
    d.setHours(hour, m, s, 0);
    onChange?.(d);
  };

  const currentHour = value ? (is12Hour ? (value.getHours() % 12 || 12) : value.getHours()) : null;
  const currentMinute = value ? value.getMinutes() : null;
  const currentSecond = value ? value.getSeconds() : null;
  const currentPeriod = value ? (value.getHours() >= 12 ? "PM" : "AM") : "AM";

  const isSideLabel = labelPlacement === "left" || labelPlacement === "right";
  const xAlignment = labelAlignX || (
    labelPlacement === "left" ? "left" : 
    labelPlacement === "right" ? "right" : "left"
  );
  const yAlignmentClass = 
    labelAlignY === "top" ? "items-start" :
    labelAlignY === "bottom" ? "items-end" : "items-center";

  const borderRadius = variant === "square" ? "rounded-none" : variant === "curved" ? "rounded-lg" : "rounded-full";

  const hasError = internalError || !!errorProp;
  const isActive = isFocused || isOpen || !!value;

  return (
    <div className={cn("flex w-full", labelPlacement === "top" && "flex-col gap-1.5", labelPlacement === "left" && cn("flex-row gap-4", yAlignmentClass), labelPlacement === "right" && cn("flex-row-reverse gap-4", yAlignmentClass), className)}>
      {label && !isFloating && (
        <div className={cn("flex flex-col", isSideLabel ? "shrink-0" : "w-full", labelAlignY === "top" && isSideLabel && "mt-2.5")}>
          <div className={cn(
            isSideLabel ? labelWidth : "w-full", 
            "flex flex-col", 
            xAlignment === "left" && "items-start text-left", 
            xAlignment === "right" && "items-end text-right", 
            xAlignment === "center" && "items-center text-center"
          )}>
            <span className="text-sm font-medium tracking-tight text-white">{label}</span>
            {description && <span className="text-[11px] text-gray-400 font-medium mt-0.5">{description}</span>}
          </div>
        </div>
      )}

      <div className="flex-1 relative group">
        {label && isFloating && (
          <span 
            className={cn(
              "absolute transition-all duration-200 pointer-events-none font-medium tracking-tight z-10 block truncate",
              isActive 
                ? "-top-4 left-6 right-auto text-sm bg-black px-1.5 text-sky-500 max-w-[calc(100%-1.5rem)]" 
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
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              placeholder={isFloating ? "" : displayFormat.toLowerCase()}
              className={cn(
                "flex items-center w-full pl-11 pr-2 h-10 border transition-all duration-200 bg-black text-md text-white outline-none placeholder:text-gray-600",
                borderRadius,
                isFocused ? "border-sky-500 ring-4 ring-sky-500/10 shadow-lg" : "border-gray-800 hover:border-gray-600",
                hasError && "border-red-500 ring-4 ring-red-500/10 text-red-500"
              )}
            />
            <Clock size={16} className={cn("absolute left-2.5 transition-colors", hasError ? "text-red-400" : "text-gray-400")} />
          </div>
        ) : (
          <button
            type="button"
            ref={refs.setReference}
            {...getReferenceProps()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "flex items-center gap-3 pr-2 w-full h-10 border transition-all duration-200 bg-black font-medium text-white cursor-pointer",
              borderRadius,
              isOpen ? "border-sky-500 ring-4 ring-sky-500/10 shadow-lg" : "border-gray-800 hover:border-gray-600",
              errorProp && "border-red-500 ring-4 ring-red-500/10"
            )}
          >
            <div className="flex items-center pl-2.25 pr-2 shrink-0">
              <Clock size={16} className="text-gray-400" />
            </div>
            <span className={cn("text-md flex-1 text-left truncate", !value && "text-gray-600")}>
              {(value && (!isFloating || isActive)) ? format(value, displayFormat) : (isFloating ? "" : (placeholder || "Select Time"))}
            </span>
            <ChevronDown size={14} className={cn("text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
          </button>
        )}

        {isOpen && !isTypeable && (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                className="z-[9999] bg-black border border-gray-800 rounded-3xl shadow-2xl animate-in fade-in duration-200 p-2 flex gap-1 h-[280px]"
              >
                {/* Hour Column */}
                <div className="flex flex-col overflow-y-auto custom-scrollbar px-1">
                   <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase p-2 sticky top-0 bg-black">Hour</div>
                   {hours.map(h => (
                     <button
                       key={h}
                       onClick={() => handleTimeSelect(h, currentMinute || 0, currentSecond || 0, currentPeriod)}
                       className={cn(
                         "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-sm font-bold transition-all cursor-pointer",
                         currentHour === h ? "bg-white text-black shadow-lg" : "hover:bg-gray-800 text-white"
                       )}
                     >
                       {h.toString().padStart(2, "0")}
                     </button>
                   ))}
                </div>

                {/* Minute Column */}
                <div className="flex flex-col overflow-y-auto custom-scrollbar px-1 border-l border-gray-800">
                   <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase p-2 sticky top-0 bg-black">Min</div>
                   {minutes.map(m => (
                     <button
                       key={m}
                       onClick={() => handleTimeSelect(currentHour || (is12Hour ? 12 : 0), m, currentSecond || 0, currentPeriod)}
                       className={cn(
                         "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-sm font-bold transition-all cursor-pointer",
                         currentMinute === m ? "bg-white text-black shadow-lg" : "hover:bg-gray-800 text-white"
                       )}
                     >
                       {m.toString().padStart(2, "0")}
                     </button>
                   ))}
                </div>

                {/* Seconds Column */}
                {showSeconds && (
                  <div className="flex flex-col overflow-y-auto custom-scrollbar px-1 border-l border-gray-800">
                    <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase p-2 sticky top-0 bg-black">Sec</div>
                    {secs.map(s => (
                      <button
                        key={s}
                        onClick={() => handleTimeSelect(currentHour || (is12Hour ? 12 : 0), currentMinute || 0, s, currentPeriod)}
                        className={cn(
                          "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-sm font-bold transition-all cursor-pointer",
                          currentSecond === s ? "bg-white text-black shadow-lg" : "hover:bg-gray-800 text-white"
                        )}
                      >
                        {s.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                )}

                {/* AM/PM Column */}
                {is12Hour && (
                  <div className="flex flex-col px-1 border-l border-gray-800">
                    <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase p-2">Per</div>
                    {["AM", "PM"].map(p => (
                      <button
                        key={p}
                        onClick={() => handleTimeSelect(currentHour || 12, currentMinute || 0, currentSecond || 0, p)}
                        className={cn(
                          "w-12 h-10 shrink-0 flex items-center justify-center rounded-lg text-[11px] font-black tracking-widest transition-all cursor-pointer",
                          currentPeriod === p ? "bg-sky-500 text-white shadow-lg" : "hover:bg-gray-800 text-white"
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
