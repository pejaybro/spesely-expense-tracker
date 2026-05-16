import React, { useState } from "react";
import { cn } from "@/src/utils";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  description?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onRightIconClick?: (e: React.MouseEvent) => void;
  variant?: "rounded" | "curved" | "square" | "floating";
  labelDirection?: 
    | "label-left" | "label-left-top" | "label-left-bottom"
    | "label-right" | "label-right-top" | "label-right-bottom"
    | "label-top" | "label-top-right" | "label-top-center";
  labelWidth?: string;
  labelAlign?: "left" | "center" | "right";
  labelGap?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    description, 
    error, 
    icon, 
    rightIcon,
    prefix,
    suffix,
    onRightIconClick,
    variant = "rounded", 
    labelDirection = "label-top",
    labelWidth = "w-32",
    labelAlign,
    labelGap = "gap-1.5",
    className, 
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const isFloating = variant === "floating";
    const hasValue = props.value !== undefined && props.value !== "";
    const isActive = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const isSideLabel = labelDirection.startsWith("label-left") || labelDirection.startsWith("label-right");
    const alignment = labelAlign || (
      labelDirection.includes("-left") ? "left" : 
      labelDirection.includes("-right") ? "right" : 
      labelDirection.includes("-center") ? "center" : "left"
    );

    const radiusClass = 
      variant === "square" ? "rounded-none" : 
      variant === "curved" ? "rounded-lg" : "rounded-xl";

    return (
      <div className={cn("flex w-full", labelGap, isSideLabel ? "flex-row" : "flex-col", className)}>
        {/* Standard Label (Non-Floating) */}
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
          {/* Floating Label */}
          {label && isFloating && (
            <span 
              className={cn(
                "absolute transition-all duration-200 pointer-events-none font-bold uppercase tracking-tight z-10 block truncate",
                isActive 
                  ? "-top-2.5 left-3 right-auto text-[10px] bg-white dark:bg-black px-1.5 text-sky-500 max-w-[calc(100%-1.5rem)]" 
                  : cn(
                      "top-1/2 -translate-y-1/2 text-[13px] text-gray-400",
                      icon ? "left-11 right-8" : "left-4 right-4"
                    )
              )}
            >
              {label}
            </span>
          )}

          <div className="relative flex items-center">
            {icon && (
              <div className={cn(
                "absolute left-4 text-gray-400 transition-colors",
                isFocused ? "text-black dark:text-white" : ""
              )}>
                {icon}
              </div>
            )}
            <input
              ref={ref}
              {...props}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                "w-full h-11 bg-white dark:bg-black border-2 text-[13px] font-semibold text-black dark:text-white transition-all duration-200 outline-none",
                radiusClass,
                (icon || prefix) ? "pl-11" : "px-4",
                (rightIcon || suffix) ? "pr-11" : ((icon || prefix) ? "" : "px-4"),
                isFocused ? "border-sky-500 ring-4 ring-sky-500/10" : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600",
                error ? "border-red-500 ring-4 ring-red-500/10" : "",
                isFloating && "placeholder:opacity-0 focus:placeholder:opacity-100"
              )}
            />
            {prefix && (
              <div className="absolute left-4 text-gray-400 font-semibold pointer-events-none">
                {prefix}
              </div>
            )}
            {suffix && (
              <div className="absolute right-4 text-gray-400 font-semibold pointer-events-none">
                {suffix}
              </div>
            )}
            {rightIcon && (
              <div 
                onClick={onRightIconClick}
                className={cn(
                  "absolute right-4 text-gray-400 transition-colors",
                  onRightIconClick ? "cursor-pointer hover:text-black dark:hover:text-white" : "",
                  isFocused ? "text-black dark:text-white" : ""
                )}
              >
                {rightIcon}
              </div>
            )}
          </div>
          {error && <span className="text-[10px] font-bold text-red-500 mt-1.5 ml-1 block animate-in fade-in slide-in-from-top-1">{error}</span>}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
