import React, { useState, useRef, useLayoutEffect } from "react";
import { cn } from "@/src/utils";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  label?: string;
  description?: string;
  error?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onRightIconClick?: (e: React.MouseEvent) => void;
  variant?: "rounded" | "curved" | "square";
  isFloating?: boolean;
  labelPlacement?: "top" | "left" | "right";
  labelWidth?: string;
  "labelAlign-X"?: "left" | "center" | "right";
  "labelAlign-Y"?: "top" | "middle" | "bottom";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      icon,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      onRightIconClick,
      variant = "curved",
      isFloating = false,
      labelPlacement = "top",
      labelWidth = "w-32",
      "labelAlign-X": labelAlignX,
      "labelAlign-Y": labelAlignY = "middle",
      className,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalHasContent, setInternalHasContent] = useState(!!props.defaultValue || !!props.value);
    const [leftElementWidth, setLeftElementWidth] = useState(0);
    const leftElementRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (leftElementRef.current) {
        setLeftElementWidth(leftElementRef.current.offsetWidth);
      }
    }, [icon, leftIcon, prefix]);

    const hasValue = (props.value !== undefined && props.value !== "") || (props.defaultValue !== undefined && props.defaultValue !== "") || internalHasContent;
    const isActive = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setInternalHasContent(e.target.value !== "");
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalHasContent(e.target.value !== "");
      props.onChange?.(e);
    };

    const isSideLabel = labelPlacement === "left" || labelPlacement === "right";

    const xAlignment =
      labelAlignX ||
      (labelPlacement === "left"
        ? "left"
        : labelPlacement === "right"
          ? "right"
          : "left");

    const yAlignmentClass =
      labelAlignY === "top"
        ? "items-start"
        : labelAlignY === "bottom"
          ? "items-end"
          : "items-center";

    const radiusClass =
      variant === "square"
        ? "rounded-none"
        : variant === "curved"
          ? "rounded-lg"
          : variant === "rounded"
            ? "rounded-full"
            : "";

    return (
      <div
        className={cn(
          "flex w-full",
          labelPlacement === "top" && "flex-col gap-1.5",
          labelPlacement === "left" && cn("flex-row gap-4", yAlignmentClass),
          labelPlacement === "right" && cn("flex-row-reverse gap-4", yAlignmentClass),
          className,
        )}
      >
        {/* Standard Label (Non-Floating) */}
        {label && !isFloating && (
          <div
            className={cn(
              "flex flex-col",
              isSideLabel ? "shrink-0" : "w-full",
              labelAlignY === "top" && isSideLabel && "mt-2.5",
            )}
          >
            <div
              className={cn(
                isSideLabel ? labelWidth : "w-full",
                "flex flex-col",
                xAlignment === "left" && "items-start text-left",
                xAlignment === "right" && "items-end text-right",
                xAlignment === "center" && "items-center text-center",
              )}
            >
              <span className="text-sm font-medium tracking-tight text-white">
                {label}
              </span>
              {description && (
                <span className="text-xs text-gray-400 font-medium mt-0.5">
                  {description}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col relative group">
          {/* Floating Label (Remains Absolute) */}
          {label && isFloating && (
            <span
              className={cn(
                "absolute transition-all duration-200 pointer-events-none font-medium tracking-tight z-10 block truncate",
                isActive
                  ? "-top-4 left-6 right-auto text-sm bg-black px-1.5 text-sky-500 max-w-[calc(100%-1.5rem)]"
                  : "top-1/2 -translate-y-1/2 text-md text-gray-400 px-4 left-0 right-0",
              )}
              style={!isActive ? { paddingLeft: `${leftElementWidth}px` } : {}}
            >
              {label}
            </span>
          )}

          {/* New Dynamic Flex Container */}
          <div
            className={cn(
              "flex items-center w-full bg-black border transition-all duration-200",
              radiusClass,
              isFocused
                ? "border-sky-500 ring-4 ring-sky-500/10 shadow-lg"
                : "border-gray-800 hover:border-gray-600",
              error ? "border-red-500 ring-4 ring-red-500/10" : "",
            )}
          >
            {/* Left Content Area */}
            {(leftIcon || icon || prefix) && (
              <div
                ref={leftElementRef}
                className="flex items-center pl-2.25 pr-2 text-gray-400 shrink-0"
              >
                {leftIcon || icon}
                {prefix && <span className="font-medium">{prefix}</span>}
              </div>
            )}

            <input
              ref={ref}
              {...props}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={isFloating && !isActive ? "" : props.placeholder}
              className={cn(
                "flex-1 bg-transparent border-none text-md text-white outline-none h-full py-2.5",
                !(leftIcon || icon || prefix) && "pl-2",
                !(rightIcon || suffix) && "pr-2",
              )}
            />

            {/* Right Content Area */}
            {(rightIcon || suffix) && (
              <div className="flex items-center pr-2.25 pl-2 text-gray-400 shrink-0">
                {suffix && <span className="font-medium">{suffix}</span>}
                {rightIcon && (
                  <div
                    onClick={onRightIconClick}
                    className={cn(
                      "transition-colors",
                      onRightIconClick
                        ? "cursor-pointer hover:text-white"
                        : "",
                      isFocused ? "text-white" : "",
                    )}
                  >
                    {rightIcon}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <span className="text-xs font-medium text-red-500 mt-1.5 ml-1 block animate-in fade-in slide-in-from-top-1">
              {error}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
