import React, { useState, useEffect } from "react";
import { cn } from "@/src/utils";
import { Checkbox } from "./checkbox";

interface CheckboxOption {
  id?: string;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  indicator?: React.ReactNode | "bullet" | "number";
}

interface CheckboxGroupProps {
  label?: string;
  description?: string;
  error?: string;
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: any) => void;
  options: CheckboxOption[];
  className?: string;
  labelPlacement?: "top" | "left" | "right";
  labelWidth?: string;
  "labelAlign-X"?: "left" | "center" | "right";
  "labelAlign-Y"?: "top" | "middle" | "bottom";
  indicator?: "dots" | "numbers" | React.ReactNode;
}

export const CheckboxGroup = ({
  label,
  description,
  error,
  type = "multiple",
  value,
  defaultValue,
  onChange,
  options = [],
  className,
  labelPlacement = "top",
  labelWidth = "w-32",
  "labelAlign-X": labelAlignX,
  "labelAlign-Y": labelAlignY = "top",
  indicator,
}: CheckboxGroupProps) => {
  const [internalValue, setInternalValue] = useState<string | string[]>(
    value || defaultValue || (type === "multiple" ? [] : ""),
  );

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const handleCheckboxChange = (optionValue: string) => {
    let newValue: string | string[];

    if (type === "single") {
      newValue = internalValue === optionValue ? "" : optionValue;
    } else {
      const currentValues = Array.isArray(internalValue) ? internalValue : [];
      newValue = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
    }

    if (value === undefined) setInternalValue(newValue);
    onChange?.(newValue);
  };

  const isSideLabel = labelPlacement === "left" || labelPlacement === "right";
  
  const xAlignment = labelAlignX || (
    labelPlacement === "left" ? "left" : 
    labelPlacement === "right" ? "right" : "left"
  );

  const yAlignmentClass = 
    labelAlignY === "top" ? "items-start" :
    labelAlignY === "bottom" ? "items-end" : "items-center";

  return (
    <div
      className={cn(
        "flex w-full",
        labelPlacement === "top" && "flex-col gap-3",
        labelPlacement === "left" && cn("flex-row gap-6", yAlignmentClass),
        labelPlacement === "right" && cn("flex-row-reverse gap-6", yAlignmentClass),
        className,
      )}
    >
      {/* Group Label Area */}
      {(label || description) && (
        <div
          className={cn(
            "flex flex-col shrink-0",
            isSideLabel ? labelWidth : "w-full",
          )}
        >
          <div
            className={cn(
              "flex flex-col",
              xAlignment === "left" && "items-start text-left",
              xAlignment === "right" && "items-end text-right",
              xAlignment === "center" && "items-center text-center",
            )}
          >
            {label && (
              <span className="text-sm font-bold tracking-tight text-white uppercase">
                {label}
              </span>
            )}
            {description && (
              <span className="text-[11px] text-gray-400 font-medium mt-0.5 leading-tight">
                {description}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Checkbox Options Area */}
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex gap-4 flex-col">
          {options.map((option, index) => {
            const isChecked =
              type === "single"
                ? internalValue === option.value
                : Array.isArray(internalValue) && internalValue.includes(option.value);

            const optIndicator = option.indicator || indicator;
            let indicatorNode = null;
            if (optIndicator === "bullet" || optIndicator === "dots") {
              indicatorNode = <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-2" />;
            } else if (optIndicator === "number" || optIndicator === "numbers") {
              indicatorNode = <span className="text-sm font-bold text-gray-500 shrink-0 mt-0.5 w-4 text-center">{index + 1}.</span>;
            } else if (optIndicator) {
              indicatorNode = <div className="shrink-0 mt-0.5 flex items-center justify-center text-sm font-medium text-gray-500">{optIndicator}</div>;
            }

            return (
              <div key={option.id || option.value || index} className="flex gap-3 items-start">
                {indicatorNode}
                <Checkbox
                  id={option.id}
                  label={option.label}
                  description={option.description}
                  disabled={option.disabled}
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(option.value)}
                  className="shrink-0 flex-1"
                />
              </div>
            );
          })}
        </div>

        {error && (
          <span className="text-[10px] font-medium text-red-500 mt-1.5 ml-1 block animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};
