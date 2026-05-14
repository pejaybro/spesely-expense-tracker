import React from "react";
import { cn } from "@/src/utils";

interface CheckboxGroupProps {
  label?: string;
  description?: string;
  error?: string;
  type?: "single" | "multiple";
  value?: string | string[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: any) => void;
  children: React.ReactNode;
  direction?: "row" | "column" | "x-axis" | "y-axis" | "horizontal" | "vertical";
  className?: string;
}

export const CheckboxGroup = ({
  label,
  description,
  error,
  type = "multiple",
  value,
  defaultValue,
  onChange,
  children,
  direction = "column",
  className,
}: CheckboxGroupProps) => {


  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    value || defaultValue || (type === "multiple" ? [] : "")
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleCheckboxChange = (id: string) => {
    let newValue: string | string[];

    if (type === "single") {
      newValue = internalValue === id ? "" : id;
    } else {
      const currentValues = Array.isArray(internalValue) ? internalValue : [];
      if (currentValues.includes(id)) {
        newValue = currentValues.filter((v) => v !== id);
      } else {
        newValue = [...currentValues, id];
      }
    }

    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
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

          const childId = child.props.id || child.props.value || child.props.label;
          const isChecked = type === "single" 
            ? internalValue === childId 
            : Array.isArray(internalValue) && internalValue.includes(childId);

          return React.cloneElement(child as React.ReactElement<any>, {
            checked: isChecked,
            onChange: () => handleCheckboxChange(childId),
            // Ensure card variants work well in groups
            className: cn(child.props.className, isHorizontal && "shrink-0")
          });
        })}
      </div>



      {error && <span className="text-xs text-red-500 ml-1 font-medium">{error}</span>}
    </div>
  );
};
