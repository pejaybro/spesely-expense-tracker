import React, { useState, useEffect } from "react";
import { cn } from "@/src/utils";
import { Radio } from "./radio";

export interface RadioOption {
  id?: string;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  className?: string;
  labelPlacement?: "top" | "left" | "right";
  labelWidth?: string;
  "labelAlign-X"?: "left" | "center" | "right";
  "labelAlign-Y"?: "top" | "middle" | "bottom";
  indicator?: "dots" | "numbers" | React.ReactNode;
}

export const RadioGroup = ({
  name,
  label,
  description,
  error,
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
}: RadioGroupProps) => {
  const uniqueName = React.useId();
  const groupName = name || uniqueName;

  const [internalValue, setInternalValue] = useState<string>(
    value || defaultValue || "",
  );

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const handleRadioChange = (id: string) => {
    if (value === undefined) setInternalValue(id);
    onChange?.(id);
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

      {/* Radio Items Area */}
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex gap-4 flex-col">
          {options.map((option, index) => {
            const isChecked = internalValue === option.value;

            let renderIndicator: React.ReactNode = null;
            if (indicator === "dots") {
              renderIndicator = <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />;
            } else if (indicator === "numbers") {
              renderIndicator = (
                <span className="text-sm font-bold text-gray-500 shrink-0 w-4 text-center">
                  {index + 1}.
                </span>
              );
            } else if (indicator !== undefined) {
              renderIndicator = (
                <div className="shrink-0 flex items-center justify-center text-sm font-medium text-gray-500">
                  {indicator}
                </div>
              );
            }

            return (
              <div key={option.id || option.value || index} className="flex items-center gap-3 w-full">
                {renderIndicator && (
                  <div className="flex items-center justify-center shrink-0">
                    {renderIndicator}
                  </div>
                )}
                <Radio
                  name={groupName}
                  label={option.label}
                  description={option.description}
                  disabled={option.disabled}
                  checked={isChecked}
                  onChange={() => handleRadioChange(option.value)}
                  className="flex-1 min-w-0"
                  value={option.value}
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
