import React, { useState } from "react";
import { cn } from "@/src/utils";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  description?: string;
  error?: string;
  labelPlacement?: "top" | "left" | "right";
  labelWidth?: string;
  "labelAlign-X"?: "left" | "center" | "right";
  "labelAlign-Y"?: "top" | "middle" | "bottom";
  activeColor?: string; 
  inactiveColor?: string; 
  thumbColor?: string; 
  onChange?: (checked: boolean) => void;
}

export const Switch = ({
  label,
  description,
  error,
  labelPlacement = "right",
  labelWidth,
  "labelAlign-X": labelAlignX,
  "labelAlign-Y": labelAlignY = "middle",
  activeColor = "bg-white",
  inactiveColor = "bg-gray-900",
  thumbColor = "bg-black",
  onChange,
  className,
  id,
  ...props
}: SwitchProps) => {
  const switchId = id || React.useId();
  
  // Support both controlled and uncontrolled states
  const [internalChecked, setInternalChecked] = useState(props.defaultChecked || false);
  const isControlled = props.checked !== undefined;
  const checked = isControlled ? props.checked : internalChecked;

  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (props.disabled) return;
    e.preventDefault();
    const nextState = !checked;
    if (!isControlled) setInternalChecked(nextState);
    onChange?.(nextState);
  };

  const isSideLabel = labelPlacement === "left" || labelPlacement === "right";
  const xAlignment = labelAlignX || (labelPlacement === "left" ? "left" : labelPlacement === "right" ? "right" : "left");
  const yAlignmentClass = labelAlignY === "top" ? "items-start" : labelAlignY === "bottom" ? "items-end" : "items-center";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={switchId}
        onClick={handleToggle}
        className={cn(
          "group flex cursor-pointer select-none transition-all duration-200 gap-4",
          labelPlacement === "top" && "flex-col",
          labelPlacement === "left" && cn("flex-row-reverse justify-between w-full", yAlignmentClass),
          labelPlacement === "right" && cn("flex-row justify-start", yAlignmentClass),
          props.disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="relative flex items-center shrink-0">
          <input 
            {...props} 
            type="checkbox" 
            id={switchId} 
            className="peer sr-only" 
            checked={checked} 
            readOnly 
          />
          <div className={cn("w-[44px] h-[24px] rounded-full transition-all duration-200 ease-in-out p-1", checked ? activeColor : inactiveColor, "peer-focus-visible:ring-4 peer-focus-visible:ring-white/10")}>
            <div className={cn("w-[16px] h-[16px] rounded-full shadow-sm transition-all duration-200 ease-in-out transform", thumbColor, checked ? "translate-x-[20px]" : "translate-x-0")} />
          </div>
        </div>

        {(label || description) && (
          <div className={cn("flex flex-col gap-0.5 min-w-0", isSideLabel ? (labelWidth || "flex-1") : "w-full", xAlignment === "left" && "items-start text-left", xAlignment === "right" && "items-end text-right", xAlignment === "center" && "items-center text-center")}>
            {label && <span className="text-sm font-medium text-white whitespace-normal break-words w-full">{label}{props.required && <span className="text-red-500 ml-1 font-black">*</span>}</span>}
            {description && <span className="text-xs text-gray-400 leading-tight whitespace-normal break-words w-full">{description}</span>}
          </div>
        )}
      </label>
      {error && <span className="text-xs font-medium text-red-500 ml-1 italic tracking-tight animate-in fade-in slide-in-from-top-1">{error}</span>}
    </div>
  );
};
