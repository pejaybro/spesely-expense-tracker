import React from "react";
import { cn } from "@/src/utils";
import { Checkbox } from "./checkbox";

export const CardCheckbox = (props: React.ComponentProps<typeof Checkbox>) => {
  const isChecked = props.isTristate ? props.tristateValue !== null : props.checked;
  
  return (
    <Checkbox 
      {...props} 
      className={cn(
        "p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-200 bg-white dark:bg-black",
        isChecked && "border-black dark:border-white bg-gray-50 dark:bg-white/5",
        props.error && "border-red-500 hover:border-red-600",
        props.className
      )}
    />
  );
};
