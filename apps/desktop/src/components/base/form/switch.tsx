import React, { useState, useEffect } from "react";
import { cn } from "@/src/utils";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  description?: string;
  error?: string;
  variant?: "default" | "card";
  activeColor?: string; // Track color when ON
  inactiveColor?: string; // Track color when OFF
  thumbColor?: string; // The "ball" color
  borderColor?: string; // Track border color
  onChange?: (checked: boolean) => void;
}

export const Switch = ({
  label,
  description,
  error,
  variant = "default",
  activeColor = "bg-emerald-500",
  inactiveColor = "bg-gray-300 dark:bg-gray-700",
  thumbColor = "bg-white",
  borderColor = "border-transparent",
  onChange,
  className,
  id,
  ...props
}: SwitchProps) => {

  const switchId = id || React.useId();
  const [isChecked, setIsChecked] = useState(props.checked || props.defaultChecked || false);

  useEffect(() => {
    if (props.checked !== undefined) {
      setIsChecked(props.checked);
    }
  }, [props.checked]);

  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (props.disabled) return;
    e.preventDefault();

    const nextState = !isChecked;
    setIsChecked(nextState);
    onChange?.(nextState);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", variant === "card" && "w-full")}>
      <label
        htmlFor={switchId}
        onClick={handleToggle}
        className={cn(
          "group flex items-start gap-4 cursor-pointer select-none transition-all duration-200",
          variant === "card" && "p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-emerald-500/30",
          variant === "card" && isChecked && "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5",
          props.disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="relative flex items-center shrink-0 mt-0.5">
          <input
            {...props}
            type="checkbox"
            id={switchId}
            className="peer sr-only"
            checked={isChecked}
            readOnly
          />
          
          {/* Track */}
          <div
            className={cn(
              "w-[46px] h-6 px-[1.5px] flex items-center rounded-full transition-all duration-200 ease-in-out border-[1.5px]",
              isChecked ? activeColor : inactiveColor,
              isChecked ? activeColor.replace("bg-", "border-") : borderColor,
              "peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/40 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-black"
            )}
          >
            {/* Thumb */}
            <div
              className={cn(
                "w-[18px] h-[18px] rounded-full shadow-sm transition-all duration-200 ease-in-out transform",
                thumbColor,
                isChecked ? "translate-x-[22px]" : "translate-x-0"
              )}
            />
          </div>









        </div>

        <div className="flex flex-col gap-0.5 min-w-0">
          {label && (
            <span className="text-sm font-bold text-black dark:text-white">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-400 leading-tight">
              {description}
            </span>
          )}
        </div>
      </label>

      {error && (
        <span className="text-xs text-red-500 ml-1 font-medium">{error}</span>
      )}
    </div>
  );
};
