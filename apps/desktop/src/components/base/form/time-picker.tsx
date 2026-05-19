import React, { useState, useRef, useLayoutEffect } from "react";
import { format as formatDate, setHours, setMinutes, isValid } from "date-fns";
import { Clock, X } from "lucide-react";
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

interface TimePickerProps {
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
  hour12?: boolean;
  isTypeable?: boolean;
  disabled?: boolean;
  className?: string;
}

export const TimePicker = ({
  value,
  onChange,
  label,
  description,
  error,
  placeholder = "Select Time",
  variant = "curved",
  isFloating = false,
  labelPlacement = "top",
  labelWidth = "w-32",
  "labelAlign-X": labelAlignX,
  "labelAlign-Y": labelAlignY = "middle",
  hour12 = true,
  isTypeable = true,
  disabled = false,
  className,
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [leftElementWidth, setLeftElementWidth] = useState(0);
  const leftElementRef = useRef<HTMLDivElement>(null);

  const isActive = isFocused || !!value;

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

  const renderTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = setMinutes(setHours(new Date(), h), m);
        const isSelected = value && formatDate(time, "HH:mm") === formatDate(value, "HH:mm");
        options.push(
          <button
            key={`${h}-${m}`}
            onClick={() => { onChange?.(time); setIsOpen(false); }}
            className={cn(
              "w-full text-left px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-tight transition-all",
              isSelected ? "bg-white text-black shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            {formatDate(time, hour12 ? "hh:mm a" : "HH:mm")}
          </button>
        );
      }
    }
    return options;
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
            <Clock size={16} />
          </div>
          
          <input
            readOnly={!isTypeable}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFloating && !isActive ? "" : placeholder}
            value={value ? formatDate(value, hour12 ? "hh:mm a" : "HH:mm") : ""}
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
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="z-[9999] bg-black border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="w-[200px] max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                {renderTimeOptions()}
              </div>
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </div>
  );
};
