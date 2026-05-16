import React, { useState, useEffect } from "react";
import { cn } from "@/src/utils";
import { Check, Minus } from "lucide-react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  description?: string;
  error?: string;
  shape?: "square" | "rounded" | "circle";
  color?: "default" | "primary" | "success" | "warning" | "danger";
  activeColor?: string;
  checkColor?: string;
  labelDirection?: 
    | "label-left" | "label-left-top" | "label-left-bottom"
    | "label-right" | "label-right-top" | "label-right-bottom"
    | "label-top" | "label-top-right" | "label-top-center";
  labelWidth?: string;
  labelAlign?: "left" | "center" | "right";
  labelGap?: string;
  icon?: "check" | "minus";
  isTristate?: boolean;
  tristateValue?: boolean | null;
  onTristateChange?: (value: boolean | null) => void;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({
  label,
  description,
  error,
  shape = "rounded",
  color = "default",
  activeColor = "bg-black dark:bg-white",
  checkColor = "text-white dark:text-black",
  labelDirection = "label-right",
  labelWidth,
  labelAlign,
  labelGap = "gap-4",
  icon = "check",
  isTristate = false,
  tristateValue = null,
  onTristateChange,
  onChange,
  className,
  id,
  ...props
}: CheckboxProps) => {

  const checkboxId = id || React.useId();
  const [internalChecked, setInternalChecked] = useState(props.checked || props.defaultChecked || false);

  useEffect(() => {
    if (props.checked !== undefined) {
      setInternalChecked(props.checked);
    }
  }, [props.checked]);

  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (props.disabled) return;
    e.preventDefault();

    if (isTristate) {
      let nextValue: boolean | null;
      if (tristateValue === null) nextValue = true;
      else if (tristateValue === true) nextValue = false;
      else nextValue = null;
      onTristateChange?.(nextValue);
    } else {
      const nextChecked = !internalChecked;
      setInternalChecked(nextChecked);
      if (onChange) {
        onChange(nextChecked);
      }
    }
  };

  const isChecked = isTristate ? tristateValue !== null : internalChecked;
  const isSideLabel = labelDirection.startsWith("label-left") || labelDirection.startsWith("label-right");

  const alignment = labelAlign || (
    labelDirection.includes("-left") ? "left" : 
    labelDirection.includes("-right") ? "right" : 
    labelDirection.includes("-center") ? "center" : "left"
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={checkboxId}
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
            id={checkboxId}
            className="peer sr-only"
            checked={isTristate ? tristateValue === true : internalChecked}
            readOnly
          />
          
          <div
            className={cn(
              "w-5 h-5 flex items-center justify-center transition-all duration-200 border-2",
              shape === "rounded" && "rounded-md",
              shape === "square" && "rounded-none",
              shape === "circle" && "rounded-full",
              isChecked 
                ? cn(activeColor, activeColor.replace("bg-", "border-"))
                : "border-gray-300 dark:border-gray-700 bg-transparent hover:border-gray-400 dark:hover:border-gray-600",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-black/40 dark:peer-focus-visible:ring-white/40"
            )}
          >
            {isChecked && (
              <span className={cn("animate-in zoom-in-50 duration-200", checkColor)}>
                {isTristate && tristateValue === null ? null : (
                  isTristate && tristateValue === false ? <Minus size={14} strokeWidth={4} /> : <Check size={14} strokeWidth={4} />
                )}
              </span>
            )}
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
