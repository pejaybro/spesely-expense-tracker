import React, { useState, useEffect } from "react";
import { Check, X as CrossIcon } from "lucide-react";
import { cn } from "@/src/utils";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  description?: string;
  error?: string;
  variant?: "default" | "card";
  shape?: "rounded" | "circle" | "square";
  checkStyle?: "filled" | "simple" | "none";
  color?: "default" | "dark";
  activeColor?: string;
  checkColor?: string;
  icon?: "check" | "cross";
  isTristate?: boolean;

  tristateValue?: "checked" | "unchecked" | "rejected";
  onTristateChange?: (value: "checked" | "unchecked" | "rejected") => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = ({
  label,
  description,
  error,
  variant = "default",
  shape = "rounded",
  checkStyle = "filled",
  color = "default",
  activeColor,
  checkColor,
  icon = "check",
  isTristate = false,

  tristateValue,
  onTristateChange,
  onChange,
  className,
  id,
  ...props
}: CheckboxProps) => {
  const checkboxId = id || React.useId();
  
  const [internalValue, setInternalValue] = useState<"checked" | "unchecked" | "rejected">(
    tristateValue || (props.checked ? "checked" : props.defaultChecked ? "checked" : "unchecked")
  );

  useEffect(() => {
    if (tristateValue) {
      setInternalValue(tristateValue);
    } else if (props.checked !== undefined) {
      setInternalValue(props.checked ? "checked" : "unchecked");
    }
  }, [tristateValue, props.checked]);

  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (props.disabled) return;
    e.preventDefault();

    let nextValue: "checked" | "unchecked" | "rejected";
    
    if (isTristate) {
      if (internalValue === "unchecked") nextValue = "checked";
      else if (internalValue === "checked") nextValue = "rejected";
      else nextValue = "unchecked";
    } else {
      nextValue = internalValue === "checked" ? "unchecked" : "checked";
    }

    setInternalValue(nextValue);
    
    if (isTristate) {
      onTristateChange?.(nextValue);
    } else {
      const isNowChecked = nextValue === "checked";
      const event = {
        target: { ...props, type: "checkbox", checked: isNowChecked, id: checkboxId },
        currentTarget: { ...props, type: "checkbox", checked: isNowChecked, id: checkboxId },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    }
  };

  const isChecked = internalValue === "checked";
  const isRejected = internalValue === "rejected";
  const isAnyChecked = internalValue !== "unchecked";

  // Decide which icon to show for the "Checked" state
  const ActiveIcon = icon === "cross" ? CrossIcon : Check;

  return (
    <div className={cn("flex flex-col gap-1.5", variant === "card" && "w-full")}>
      <label
        htmlFor={checkboxId}
        onClick={handleToggle}
        className={cn(
          "group flex items-start gap-3 cursor-pointer select-none transition-all duration-200",
          variant === "card" && "p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-sky-500/50",
          variant === "card" && isChecked && (
            activeColor ? `${activeColor} border-transparent text-white` :
            color === "dark" 
              ? "bg-black border-black text-white" 
              : "border-sky-50 bg-sky-50/30 dark:bg-sky-500/5 border-sky-500"
          ),
          variant === "card" && isRejected && (
            color === "dark" 
              ? "bg-black border-black text-white" 
              : "border-red-500 bg-red-50/30 dark:bg-red-500/5"
          ),
          props.disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            {...props}
            type="checkbox"
            id={checkboxId}
            className="peer sr-only"
            checked={isAnyChecked}
            readOnly
          />
          
          <div
            className={cn(
              "w-5 h-5 border-2 transition-all duration-200 flex items-center justify-center",
              shape === "rounded" && "rounded-md",
              shape === "circle" && "rounded-full",
              shape === "square" && "rounded-none",
              
              // Base colors
              "border-gray-200 dark:border-gray-800 bg-white dark:bg-black",
              
              // State colors (Checked or Rejected)
              (isChecked || isRejected) && (
                checkStyle === "simple" 
                  ? (activeColor ? activeColor.replace("bg-", "border-") : (isRejected ? "border-black dark:border-white" : "border-black dark:border-white"))
                  : (activeColor ? `${activeColor} ${activeColor.replace("bg-", "border-")}` : (color === "dark" ? "bg-black border-gray-700" : "bg-black dark:bg-white border-black dark:border-white"))
              ),

              // Background only case
              (checkStyle === "none" && isAnyChecked) && (activeColor ? activeColor : (color === "dark" ? "bg-black border-gray-700" : "bg-black dark:bg-white border-black dark:border-white")),

              "peer-focus-visible:ring-2 peer-focus-visible:ring-sky-500/40 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-black",
              "group-hover:border-black dark:group-hover:border-white"
            )}
          />

          {/* Render the appropriate icon based on state */}
          {checkStyle !== "none" && (
            <>
              {isChecked && (
                <ActiveIcon
                  size={14}
                  strokeWidth={4}
                  className={cn(
                    "absolute pointer-events-none transition-all duration-200 scale-100",
                    checkColor ? checkColor : (
                      checkStyle === "filled" 
                        ? (color === "dark" ? "text-white" : "text-white dark:text-black") 
                        : (icon === "cross" ? "text-red-500" : "text-black dark:text-white")
                    )
                  )}
                />
              )}
              {isRejected && (
                <CrossIcon
                  size={14}
                  strokeWidth={4}
                  className={cn(
                    "absolute pointer-events-none transition-all duration-200 scale-100",
                    checkColor ? checkColor : (checkStyle === "filled" ? (color === "dark" ? "text-white" : "text-white dark:text-black") : "text-black dark:text-white")
                  )}
                />
              )}

            </>
          )}
        </div>

        <div className="flex flex-col gap-0.5 min-w-0">
          {label && (
            <span className="text-sm font-bold text-black dark:text-white">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500 leading-tight">
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
