import React, { useState } from "react";
import { Input } from "./input";

import { Plus, Minus } from "lucide-react";
import { cn } from "@/src/utils";

interface NumberInputProps extends React.ComponentProps<typeof Input> {
  showSteppers?: boolean;
  step?: number;
  min?: number;
  max?: number;
  allowNegative?: boolean;
}

export const NumberInput = ({
  showSteppers = true,
  step = 1,
  min,
  max,
  allowNegative = false,
  onChange,
  className,
  ...props
}: NumberInputProps) => {
  const [value, setValue] = useState((props.value as string) || "");

  const updateValue = (newVal: number | string) => {
    // 1. Convert to a pure number for calculations
    let numeric = typeof newVal === "number" ? newVal : parseFloat(String(newVal).replace(/,/g, ""));
    
    if (isNaN(numeric)) {
      // If it's just a "-" sign being typed, allow it if allowNegative is true
      if (allowNegative && String(newVal) === "-") {
        setValue("-");
        return;
      }
      setValue("");
      return;
    }

    // 2. Enforce allowNegative
    if (!allowNegative && numeric < 0) numeric = 0;

    // 3. Enforce min/max
    if (min !== undefined && numeric < min) numeric = min;
    if (max !== undefined && numeric > max) numeric = max;

    // 4. Convert back to string and update state
    const finalVal = String(numeric);
    setValue(finalVal);
    
    const event = {
      target: { value: finalVal },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(event);
  };



  const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(e.target.value);
  };

  const handleIncrement = () => {
    const current = Number(value) || 0;
    updateValue(current + step);
  };

  const handleDecrement = () => {
    const current = Number(value) || 0;
    updateValue(current - step);
  };

  const isNegativeValue = value.startsWith("-");

  return (
    <Input
      placeholder="0"
      {...props}
      type="tel"
      value={value}
      onChange={handleInternalChange}

      className={cn(
        isNegativeValue && "text-red-500 font-medium focus-within:border-red-500 focus-within:ring-red-500/20",
        className
      )}
      rightIcon={

        showSteppers && (
          <div className="flex items-center gap-1 border-l border-gray-100 dark:border-gray-800 pl-2 ml-1">
            <button
              type="button"
              onClick={handleDecrement}
              className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 hover:text-black dark:hover:text-white"
            >
              <Minus size={14} />
            </button>
            <button
              type="button"
              onClick={handleIncrement}
              className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500 hover:text-black dark:hover:text-white"
            >
              <Plus size={14} />
            </button>
          </div>
        )
      }
    />
  );
};

