import React, { useRef } from "react";
import { cn } from "@/src/utils";
import { X } from "lucide-react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: React.ReactNode;
  labelDirection?: "top" | "left" | "right";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  error?: string;
  success?: string | boolean;
  containerClassName?: string;
  prefix?: React.ReactNode;
  clearable?: boolean;
}





export const Input = ({
  label,
  labelDirection = "top",
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
  error,
  success,
  className,
  containerClassName,
  id,
  prefix,
  clearable,
  ...props
}: InputProps) => {
  const inputId = id || React.useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (inputRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      nativeInputValueSetter?.call(inputRef.current, "");
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
      
      // Also trigger onChange for React
      const changeEvent = {
        target: inputRef.current,
        currentTarget: inputRef.current,
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange?.(changeEvent);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full gap-1.5",
        labelDirection === "top" && "flex-col",
        labelDirection === "left" && "flex-row items-center",
        labelDirection === "right" && "flex-row-reverse items-center",
        containerClassName
      )}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium text-black dark:text-white shrink-0",
            labelDirection === "top" && "ml-1",
            labelDirection === "left" && "mr-2",
            labelDirection === "right" && "ml-2"
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex flex-col flex-1 gap-1">
        <div
          className={cn(
            "flex items-center w-full h-10 px-3 rounded-xl border bg-white dark:bg-black transition-all duration-200 ease-in-out focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500",
            "border-gray-200 dark:border-gray-800",
            error && "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20",
            success && !error && "border-green-500 focus-within:border-green-500 focus-within:ring-green-500/20"
          )}
        >
          {prefix && (
            <div className="mr-2 pr-2 border-r border-gray-100 dark:border-gray-800 h-1/2 flex items-center text-sm font-semibold text-gray-500">
              {prefix}
            </div>
          )}
          {leftIcon && (

            <div
              className={cn(
                "mr-2 text-gray-400 shrink-0",
                onLeftIconClick && "cursor-pointer hover:text-black dark:hover:text-white transition-colors"
              )}
              onClick={onLeftIconClick}
            >
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              "w-full h-full bg-transparent text-sm text-black dark:text-white placeholder:text-gray-400 outline-none",
              "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
              className
            )}
            ref={inputRef}
            {...props}
          />

          {(rightIcon || (clearable && props.value)) && (
            <div
              className={cn(
                "ml-2 text-gray-400 shrink-0 flex items-center gap-2",
                (onRightIconClick || clearable) && "cursor-pointer"
              )}
            >
              {clearable && props.value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              {rightIcon && (
                <div onClick={onRightIconClick} className="hover:text-black dark:hover:text-white transition-colors">
                  {rightIcon}
                </div>
              )}
            </div>
          )}

        </div>
        {error && (
          <span className="text-xs text-red-500 ml-1 font-medium">{error}</span>
        )}
        {success && !error && typeof success === "string" && (
          <span className="text-xs text-green-500 ml-1 font-medium">
            {success}
          </span>
        )}

      </div>
    </div>
  );
};



