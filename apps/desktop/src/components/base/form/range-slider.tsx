import React, { useState, useEffect } from "react";
import { cn } from "@/src/utils";

interface RangeSliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
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
  showValue?: boolean;
  valueSuffix?: string;
  onChange?: (value: number) => void;
}

export const RangeSlider = ({
  label,
  description,
  error,
  labelDirection = "label-top",
  labelWidth = "w-32",
  labelAlign,
  labelGap = "gap-4",
  showValue = true,
  valueSuffix = "",
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  id,
  ...props
}: RangeSliderProps) => {
  const sliderId = id || React.useId();
  const [internalValue, setInternalValue] = useState(Number(props.value || props.defaultValue || min));

  useEffect(() => {
    if (props.value !== undefined) {
      setInternalValue(Number(props.value));
    }
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const percentage = ((internalValue - Number(min)) / (Number(max) - Number(min))) * 100;
  const isSideLabel = labelDirection.startsWith("label-left") || labelDirection.startsWith("label-right");

  const alignment = labelAlign || (
    labelDirection.includes("-left") ? "left" : 
    labelDirection.includes("-right") ? "right" : 
    labelDirection.includes("-center") ? "center" : "left"
  );

  return (
    <div
      className={cn(
        "flex w-full",
        labelGap,
        isSideLabel ? "flex-row" : "flex-col",
        (labelDirection === "label-left" || labelDirection === "label-right") && "items-center",
        labelDirection.endsWith("-top") && isSideLabel && "mt-1 items-start",
        labelDirection.endsWith("-bottom") && isSideLabel && "items-end",
        labelDirection.startsWith("label-right") && "flex-row-reverse",
        className
      )}
    >
      {label && (
        <div 
          className={cn(
            "flex flex-col",
            isSideLabel ? "shrink-0" : "w-full",
            labelDirection.endsWith("-top") && isSideLabel && "mt-1.5"
          )}
        >
          <div className={cn(
            isSideLabel ? labelWidth : "w-full", 
            "flex flex-col gap-1", 
            alignment === "left" && "items-start text-left", 
            alignment === "right" && "items-end text-right", 
            alignment === "center" && "items-center text-center"
          )}>
            {/* Row 1: Label & Number */}
            <div className="flex justify-between items-center w-full gap-4">
              <label
                htmlFor={sliderId}
                className="text-sm font-medium text-black dark:text-white cursor-pointer select-none whitespace-normal wrap-break-word"
              >
                {label}
              </label>
              {showValue && !isSideLabel && (
                <span className="text-sm font-black tabular-nums text-black dark:text-white shrink-0 leading-none">
                  {internalValue}{valueSuffix}
                </span>
              )}
            </div>
            
            {/* Row 2: Description */}
            {description && (
              <span className="text-xs text-gray-500 leading-tight whitespace-normal wrap-break-word w-full">
                {description}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Row 3: Slider */}
      <div className="flex-1 flex items-center gap-4">
        {showValue && isSideLabel && labelDirection.startsWith("label-left") && (
          <span className="text-sm font-black tabular-nums text-black dark:text-white shrink-0 min-w-[3ch] text-right">
            {internalValue}{valueSuffix}
          </span>
        )}

        <div className="relative flex-1 flex items-center h-6 group">
          <div className="absolute w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black dark:bg-white transition-all duration-100 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <input
            {...props}
            type="range"
            id={sliderId}
            min={min}
            max={max}
            step={step}
            value={internalValue}
            onChange={handleChange}
            className={cn(
              "absolute w-full h-6 appearance-none bg-transparent cursor-pointer z-10",
              "focus:outline-none",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:dark:border-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:active:scale-90",
              "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:dark:border-white [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:active:scale-90"
            )}
          />
        </div>

        {showValue && isSideLabel && labelDirection.startsWith("label-right") && (
          <span className="text-sm font-black tabular-nums text-black dark:text-white shrink-0 min-w-[3ch] text-left">
            {internalValue}{valueSuffix}
          </span>
        )}
      </div>




      {error && (
        <span className="text-xs font-medium text-red-500 italic tracking-tight">
          {error}
        </span>
      )}
    </div>
  );
};

