import React, { useState, useEffect } from "react";
import { cn } from "@/src/utils";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  description?: string;
  error?: string;
  labelDirection?: 
    | "label-left" | "label-left-top" | "label-left-bottom"
    | "label-right" | "label-right-top" | "label-right-bottom"
    | "label-top" | "label-top-right" | "label-top-center";
  labelWidth?: string;
  labelAlign?: "left" | "center" | "right";
  labelGap?: string;
  activeColor?: string; 
  inactiveColor?: string; 
  thumbColor?: string; 
  onChange?: (checked: boolean) => void;
}

export const Switch = ({
  label,
  description,
  error,
  labelDirection = "label-right",
  labelWidth,
  labelAlign,
  labelGap = "gap-4",
  activeColor = "bg-black dark:bg-white",
  inactiveColor = "bg-gray-100 dark:bg-gray-800",
  thumbColor = "bg-white dark:bg-black",
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

  const isSideLabel = labelDirection.startsWith("label-left") || labelDirection.startsWith("label-right");

  const alignment = labelAlign || (
    labelDirection.includes("-left") ? "left" : 
    labelDirection.includes("-right") ? "right" : 
    labelDirection.includes("-center") ? "center" : "left"
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={switchId}
        onClick={handleToggle}
        className={cn(
          "group flex cursor-pointer select-none transition-all duration-200",
          labelGap,
          isSideLabel ? "flex-row" : "flex-col",
          (labelDirection === "label-left" || labelDirection === "label-right") && "items-center",
          labelDirection.endsWith("-top") && "items-start pt-0.5",
          labelDirection.endsWith("-bottom") && "items-end",
          alignment === "center" && "items-center text-center",
          labelDirection.startsWith("label-left") && "flex-row-reverse justify-between w-full",
          labelDirection.startsWith("label-right") && "flex-row justify-between w-full",
          props.disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="relative flex items-center shrink-0">
          <input
            {...props}
            type="checkbox"
            id={switchId}
            className="peer sr-only"
            checked={isChecked}
            readOnly
          />
          
          <div
            className={cn(
              "w-[44px] h-[24px] rounded-full transition-all duration-200 ease-in-out p-1",
              isChecked ? activeColor : inactiveColor,
              "peer-focus-visible:ring-2 peer-focus-visible:ring-black/40 dark:peer-focus-visible:ring-white/40"
            )}
          >
            <div
              className={cn(
                "w-[16px] h-[16px] rounded-full shadow-sm transition-all duration-200 ease-in-out transform",
                thumbColor,
                isChecked ? "translate-x-[20px]" : "translate-x-0"
              )}
            />
          </div>
        </div>

        <div 
          className={cn(
            "flex flex-col gap-0.5 min-w-0",
            isSideLabel ? (labelWidth || "flex-1") : "w-full",
            alignment === "left" && "items-start text-left",
            alignment === "right" && "items-end text-right",
            alignment === "center" && "items-center text-center"
          )}
        >
          <div className={cn(
            labelWidth ? labelWidth : "w-full", 
            "flex flex-col", 
            alignment === "left" && "items-start", 
            alignment === "right" && "items-end", 
            alignment === "center" && "items-center"
          )}>
            {label && (
              <span className="text-sm font-bold text-black dark:text-white whitespace-normal wrap-break-word w-full">
                {label}
                {props.required && <span className="text-red-500 ml-1 font-black">*</span>}
              </span>
            )}
            {description && (
              <span className="text-xs text-gray-500 leading-tight whitespace-normal wrap-break-word w-full">
                {description}
              </span>
            )}
          </div>
        </div>
      </label>

      {error && (
        <span className="text-xs font-bold text-red-500 ml-1 italic tracking-tight animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
};
