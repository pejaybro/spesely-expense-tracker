import React, { useState } from "react";
import { cn } from "@/src/utils";

interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  description?: string;
  error?: string;
  labelPlacement?: "top" | "left" | "right";
  labelWidth?: string;
  "labelAlign-X"?: "left" | "center" | "right";
  "labelAlign-Y"?: "top" | "middle" | "bottom";
  activeColor?: string;
}

export const Radio = ({
  label,
  description,
  error,
  labelPlacement = "right",
  labelWidth,
  "labelAlign-X": labelAlignX,
  "labelAlign-Y": labelAlignY = "middle",
  activeColor = "bg-white",
  className,
  id,
  ...props
}: RadioProps) => {
  const radioId = id || React.useId();

  // Support both controlled and uncontrolled states
  const [internalChecked, setInternalChecked] = useState(
    props.defaultChecked || false,
  );
  const isControlled = props.checked !== undefined;
  const checked = isControlled ? props.checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    const newChecked = e.target.checked;
    if (!isControlled) setInternalChecked(newChecked);
    props.onChange?.(e);
  };

  const isSideLabel = labelPlacement === "left" || labelPlacement === "right";
  const xAlignment =
    labelAlignX || (labelPlacement === "left" ? "right" : "left");
  const yAlignmentClass =
    labelAlignY === "top"
      ? "items-start"
      : labelAlignY === "bottom"
        ? "items-end"
        : "items-center";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={radioId}
        className={cn(
          "group flex cursor-pointer select-none transition-all duration-200 gap-2",
          labelPlacement === "top" && "flex-col",
          labelPlacement === "left" &&
            cn("flex-row-reverse justify-end", yAlignmentClass),
          labelPlacement === "right" &&
            cn("flex-row justify-start", yAlignmentClass),
          props.disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <div className="relative flex items-center shrink-0">
          <input
            {...props}
            type="radio"
            id={radioId}
            className="peer sr-only"
            checked={checked}
            onChange={handleChange}
          />
          <div
            className={cn(
              "w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center bg-black",
              checked
                ? "border-white shadow-lg scale-110"
                : "border-gray-800 group-hover:border-gray-600",
              "peer-focus-visible:ring-4 peer-focus-visible:ring-white/10",
            )}
          >
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300 transform",
                activeColor,
                checked ? "opacity-100 scale-100" : "opacity-0 scale-50",
              )}
            />
          </div>
        </div>

        {(label || description) && (
          <div
            className={cn(
              "flex flex-col gap-0.5 min-w-0",
              isSideLabel ? labelWidth || "flex-1" : "w-full",
              xAlignment === "left" && "items-start text-left",
              xAlignment === "right" && "items-end text-right",
              xAlignment === "center" && "items-center text-center",
            )}
          >
            {label && (
              <span className="text-sm font-medium text-white whitespace-normal break-words w-full">
                {label}
                {props.required && (
                  <span className="text-red-500 ml-1 font-black">*</span>
                )}
              </span>
            )}
            {description && (
              <span className="text-xs text-gray-400 leading-tight whitespace-normal break-words w-full">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
      {error && (
        <span className="text-xs font-medium text-red-500 ml-1 italic tracking-tight animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
};
