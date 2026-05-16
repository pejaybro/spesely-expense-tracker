import React from "react";
import { cn } from "@/src/utils";

interface RadioGroupProps {
  label?: string;
  description?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  direction?: "row" | "column" | "x-axis" | "y-axis" | "horizontal" | "vertical";
  className?: string;
}

export const RadioGroup = ({
  label,
  description,
  error,
  value,
  defaultValue,
  onChange,
  children,
  direction = "column",
  className,
}: RadioGroupProps) => {
  const [internalValue, setInternalValue] = React.useState<string>(
    value || defaultValue || ""
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleRadioChange = (id: string) => {
    if (value === undefined) {
      setInternalValue(id);
    }
    onChange?.(id);
  };

  const isHorizontal = direction === "row" || direction === "x-axis" || direction === "horizontal";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {(label || description) && (
        <div className="flex flex-col gap-0.5 ml-1">
          {label && <span className="text-sm font-bold text-black dark:text-white">{label}</span>}
          {description && <span className="text-xs text-gray-500">{description}</span>}
        </div>
      )}

      <div
        className={cn(
          "flex gap-4",
          isHorizontal ? "flex-row flex-wrap" : "flex-col"
        )}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          const childElement = child as React.ReactElement<any>;
          const childId = childElement.props.id || childElement.props.value || childElement.props.label;
          const isChecked = internalValue === childId;

          return React.cloneElement(childElement, {
            checked: isChecked,
            onChange: () => handleRadioChange(childId),
            className: cn(childElement.props.className, isHorizontal && "shrink-0")
          });
        })}
      </div>

      {error && <span className="text-xs text-red-500 ml-1 font-medium">{error}</span>}
    </div>
  );
};
