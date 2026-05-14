import React, { useState } from "react";
import { Input } from "./input";
import { cn } from "@/src/utils";


interface AmountInputProps extends React.ComponentProps<typeof Input> {
  decimalScale?: number;
  min?: number;
  max?: number;
  allowNegative?: boolean;
  fixedDecimalOnBlur?: boolean;
}

export const AmountInput = ({
  decimalScale = 2,
  min,
  max,
  allowNegative = false,
  fixedDecimalOnBlur = false,
  onChange,
  onBlur,
  className,
  ...props
}: AmountInputProps) => {
  const [value, setValue] = useState((props.value as string) || "");

  const formatAmount = (val: string) => {
    if (!val || val === "-") return val;
    const isNegative = val.startsWith("-");
    const clean = val.replace(/[^\d.]/g, "");
    const parts = clean.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    let result = parts[0];
    if (parts.length >= 2) {
      result += `.${parts[1].slice(0, decimalScale)}`;
    }
    
    return isNegative ? `-${result}` : result;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (fixedDecimalOnBlur && value && value !== "-") {
      const numeric = parseFloat(value.replace(/,/g, ""));
      if (!isNaN(numeric)) {
        let fixedValue = value;
        
        // Only force .00 if there's no decimal point currently
        if (!value.includes(".")) {
          const targetScale = Math.min(decimalScale, 2);
          fixedValue = formatAmount(numeric.toFixed(targetScale));
        }

        if (fixedValue !== value) {
          setValue(fixedValue);
          const event = {
            ...e,
            target: { ...e.target, value: fixedValue }
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange?.(event);
        }
      }
    }
    onBlur?.(e);
  };



  const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    
    if (allowNegative) {
      // Keep only digits, one dot, and one leading minus
      rawValue = rawValue.replace(/(?!^)-/g, "").replace(/[^\d.-]/g, "");
      // Ensure only one dot
      const dotParts = rawValue.split(".");
      if (dotParts.length > 2) rawValue = `${dotParts[0]}.${dotParts[1]}`;
    } else {
      rawValue = rawValue.replace(/[^\d.]/g, "");
    }

    const numericValue = parseFloat(rawValue.replace(/,/g, ""));

    if (!isNaN(numericValue)) {
      if (min !== undefined && numericValue < min) rawValue = String(min);
      if (max !== undefined && numericValue > max) rawValue = String(max);
    }

    const val = formatAmount(rawValue);
    setValue(val);
    
    const event = {
      ...e,
      target: {
        ...e.target,
        value: val,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange?.(event);
  };

  const isNegativeValue = value.startsWith("-");

  return (
    <Input
      {...props}
      type="tel"
      value={value}
      onChange={handleInternalChange}
      onBlur={handleBlur}
      className={cn(

        isNegativeValue && "text-red-500 font-semibold focus-within:border-red-500 focus-within:ring-red-500/20",
        className
      )}
    />
  );
};

