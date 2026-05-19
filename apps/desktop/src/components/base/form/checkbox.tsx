import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/src/utils";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  description?: string;
  error?: string;
  labelPlacement?: "top" | "left" | "right";
  labelWidth?: string;
  "labelAlign-X"?: "left" | "center" | "right";
  "labelAlign-Y"?: "top" | "middle" | "bottom";
  variant?: "rounded" | "curved" | "square" | "circle";
  activeColor?: string;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({
  label,
  description,
  error,
  labelPlacement = "left",
  labelWidth,
  "labelAlign-X": labelAlignX,
  "labelAlign-Y": labelAlignY = "middle",
  variant = "rounded",
  activeColor = "bg-white",
  onChange,
  className,
  id,
  ...props
}: CheckboxProps) => {
  const checkboxId = id || React.useId();
  
  // Support both controlled and uncontrolled states
  const [internalChecked, setInternalChecked] = useState(props.defaultChecked || false);
  const isControlled = props.checked !== undefined;
  const checked = isControlled ? props.checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    const newChecked = e.target.checked;
    if (!isControlled) setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  const isSideLabel = labelPlacement === "left" || labelPlacement === "right";
  const xAlignment = labelAlignX || (labelPlacement === "left" ? "left" : labelPlacement === "right" ? "right" : "left");
  const yAlignmentClass = labelAlignY === "top" ? "items-start" : labelAlignY === "bottom" ? "items-end" : "items-center";
  const borderRadius = variant === "circle" ? "rounded-full" : variant === "square" ? "rounded-none" : variant === "curved" ? "rounded-md" : "rounded-lg";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={checkboxId}
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
            id={checkboxId} 
            className="peer sr-only" 
            checked={checked} 
            onChange={handleChange} 
          />
          <div className={cn("w-5 h-5 border-2 transition-all duration-200 flex items-center justify-center bg-black", borderRadius, checked ? cn(activeColor, "border-transparent shadow-lg scale-110") : "border-gray-800 group-hover:border-gray-600", "peer-focus-visible:ring-4 peer-focus-visible:ring-white/10")}>
            <Check size={12} strokeWidth={4} className={cn("transition-all duration-200 transform", checked ? "scale-100 opacity-100" : "scale-50 opacity-0", activeColor.includes("white") ? "text-black" : "text-white")} />
          </div>
        </div>

        {(label || description) && (
          <div className={cn("flex flex-col gap-0.5 min-w-0", isSideLabel ? (labelWidth || "flex-1") : "w-full", xAlignment === "left" && "items-start text-left", xAlignment === "right" && "items-end text-right", xAlignment === "center" && "items-center text-center")}>
            {label && <span className="text-sm font-medium text-white whitespace-normal break-words w-full capitalize">{label}{props.required && <span className="text-red-500 ml-1 font-black">*</span>}</span>}
            {description && <span className="text-xs text-gray-400 leading-tight whitespace-normal break-words w-full">{description}</span>}
          </div>
        )}
      </label>
      {error && <span className="text-xs font-medium text-red-500 ml-1 italic tracking-tight animate-in fade-in slide-in-from-top-1">{error}</span>}
    </div>
  );
};
