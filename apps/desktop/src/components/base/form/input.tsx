import React, { useRef } from "react";
import { cn } from "@/src/utils";

/*
 * ============================================================================
 * Types & Interfaces
 * ============================================================================
 */

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  /** Optional main text label displayed above or next to the input */
  label?: string;
  /** Optional secondary text helper details shown underneath the label */
  description?: string;
  /** Validation error text which triggers error borders and shows below the input */
  error?: string;
  /** Explicit left-side icon Node */
  leftIcon?: React.ReactNode;
  /** Optional right-side clickable/decorative icon Node */
  rightIcon?: React.ReactNode;
  /** Static text content displayed inside the input box on the left */
  prefix?: React.ReactNode;
  /** Static text content displayed inside the input box on the right */
  suffix?: React.ReactNode;
  /** Click action handler triggered when clicking the rightIcon */
  onRightIconClick?: (e: React.MouseEvent) => void;
  /** Controls layout position of label relative to the input box */
  labelPlacement?: "top" | "left" | "right";
  /** Sets standard width constraints when using horizontal/side labels */
  labelWidth?: string;
  /** Custom horizontal text alignments for the label content */
  "labelAlign-X"?: "left" | "center" | "right";
  /** Custom vertical cross-axis alignments for side label layout blocks */
  "labelAlign-Y"?: "top" | "middle" | "bottom";
  /** Renders phone input calling code prefix styles */
  countryCode?: string;
}

/*
 * ============================================================================
 * Component Style Theme Configuration
 * ============================================================================
 */

const INPUT_STYLE = {
  // Colors & Formats
  bg: "bg-white",
  inputBoxFormat: "rounded-lg w-30",
  textFormat: " tracking-normal text-md font-medium text-black",
  placeholderFormat: "placeholder:text-gray-300 placeholder:truncate",

  // Focus & Default Border/Ring Config
  borderWidth: "border-[1.5px]",
  ringWidth: "ring-[2px]",
  borderDefault: "border-gray-300",
  borderFocus: "border-sky-500",
  ringFocus: "ring-sky-500/15",

  // Validation Error Styling
  borderError: "border-red-600",
  ringError: "ring-red-600/15",
  errorTextFormat: "text-red-600 text-xs font-medium",

  // Icon & Decorator Color Accents
  iconLeft: "text-black",
  iconRight: "text-black",

  // Label & Helper text styling
  labelFormat: "text-md font-medium tracking-tight text-black",
  descriptionFormat: "text-xs text-black font-medium mt-0.5",

  /* Static Prefix / Suffix styling */
  suffixFormat: "font-medium",
  prefixFormat: "font-medium",
};

/*
 * ============================================================================
 * Main Input Component (ForwardRef Enabled)
 * ============================================================================
 */

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      onRightIconClick,
      labelPlacement = "top",
      labelWidth = "w-32",
      "labelAlign-X": labelAlignX,
      "labelAlign-Y": labelAlignY = "middle",
      countryCode,
      ...props
    },
    ref,
  ) => {
    /* Stores previous input content to revert/roll back invalid characters */
    const prevValueRef = useRef(
      props.value?.toString() || props.defaultValue?.toString() || "",
    );

    /*
     * ------------------------------------------------------------------------
     * Event Handlers & Sanitizers
     * ------------------------------------------------------------------------
     */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      /* Sanitization rules for numbers (Forces float formats, locks max value limits) */
      if (props.type === "number") {
        val = val.replace(/[^0-9.]/g, "");
        const parts = val.split(".");
        if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
        if (val.includes(".")) {
          const [intP, decP] = val.split(".");
          val = `${intP}.${decP.slice(0, 2)}`;
        }
        if (props.max !== undefined && Number(val) > Number(props.max)) {
          val = prevValueRef.current;
        }
        e.target.value = val;
      } 
      /* Sanitization rules for telephone digits (enforces numeric digits + maxLength check) */
      else if (props.type === "tel") {
        val = val.replace(/\D/g, "");
        const maxLen = props.maxLength || 10;
        if (val.length > maxLen) {
          val = val.slice(0, maxLen);
        }
        e.target.value = val;
      }

      /* Sync refs and call external parent listeners */
      prevValueRef.current = e.target.value;
      props.onChange?.(e);
    };

    /*
     * ------------------------------------------------------------------------
     * Layout & Position Compilations
     * ------------------------------------------------------------------------
     */

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

    /*
     * ------------------------------------------------------------------------
     * Renders Component Layout Tree
     * ------------------------------------------------------------------------
     */

    return (
      <div
        className={cn(
          "flex w-full",
          labelPlacement === "top" && "flex-col gap-1.5",
          labelPlacement === "left" && cn("flex-row gap-4", yAlignmentClass),
          labelPlacement === "right" &&
            cn("flex-row-reverse gap-4", yAlignmentClass),
        )}
      >
        {/* Standard Label & Optional Helper Text Block */}
        {label && (
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
              <span className={cn(INPUT_STYLE.labelFormat)}>{label}</span>
              {description && (
                <span className={cn(INPUT_STYLE.descriptionFormat)}>
                  {description}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Input Wrapper Group */}
        <div className="flex-1 min-w-0 flex flex-col relative group">
          {/* Dynamic Flex Container representing the input borders and decorators */}
          <div
            className={cn(
              "flex items-center transition-all duration-200 gap-0",
              INPUT_STYLE.inputBoxFormat,
              INPUT_STYLE.borderWidth,
              INPUT_STYLE.bg,
              INPUT_STYLE.borderDefault,
              `focus-within:${INPUT_STYLE.borderFocus} focus-within:${INPUT_STYLE.ringWidth} focus-within:${INPUT_STYLE.ringFocus}`,
              error
                ? `${INPUT_STYLE.borderError} ${INPUT_STYLE.ringWidth} ${INPUT_STYLE.ringError}`
                : "",
            )}
          >
            {/* Left Content Decorators (Icon / Prefix / Country Calling Code) */}
            {(leftIcon || prefix || countryCode) && (
              <div
                className={cn(
                  "flex items-center pl-2 pr-2 shrink-0 gap-1.5",
                  INPUT_STYLE.iconLeft,
                )}
              >
                {leftIcon}
                {(prefix || countryCode) && (
                  <span className={cn(INPUT_STYLE.prefixFormat)}>
                    {countryCode || prefix}
                  </span>
                )}
              </div>
            )}

            {/* Native HTML Input Element */}
            <input
              ref={ref}
              {...props}
              type={
                props.type === "number" || props.type === "tel"
                  ? "text"
                  : props.type
              }
              inputMode={
                props.type === "number"
                  ? "decimal"
                  : props.type === "tel"
                    ? "numeric"
                    : props.inputMode
              }
              onChange={handleChange}
              placeholder={props.placeholder}
              className={cn(
                "flex-1 w-full min-w-0 bg-transparent border-none outline-none h-full py-1.5 truncate",
                INPUT_STYLE.textFormat,
                INPUT_STYLE.placeholderFormat,
                !(leftIcon || prefix) && "pl-2",
                !(rightIcon || suffix) && "pr-2",
              )}
            />

            {/* Right Content Decorators (Suffix / Interactive Right Action Icon) */}
            {(rightIcon || suffix) && (
              <div
                className={cn(
                  "flex items-center pr-2.25 pl-2 shrink-0",
                  INPUT_STYLE.iconRight,
                )}
              >
                {suffix && (
                  <span className={cn(INPUT_STYLE.suffixFormat)}>{suffix}</span>
                )}
                {rightIcon && (
                  <div
                    onClick={onRightIconClick}
                    className={cn(
                      "transition-colors group-focus-within:text-white",
                      onRightIconClick && "cursor-pointer",
                    )}
                  >
                    {rightIcon}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Validation Error Message Display */}
          {error && (
            <span
              className={cn(
                INPUT_STYLE.errorTextFormat,
                "mt-1.5 ml-1 block animate-in fade-in slide-in-from-top-1",
              )}
            >
              {error}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
