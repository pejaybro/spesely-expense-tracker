import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { cn } from "@/src/utils";

interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "prefix"> {
  label?: string;
  description?: string;
  error?: string;
  variant?: "rounded" | "curved" | "square";
  isFloating?: boolean;
  labelPlacement?: "top" | "left" | "right";
  labelWidth?: string;
  "labelAlign-X"?: "left" | "center" | "right";
  "labelAlign-Y"?: "top" | "middle" | "bottom";
  autoResize?: boolean;
  maxHeight?: string;
  allowResize?: "none" | "both" | "vertical" | "horizontal";
  showCount?: "characters" | "words" | "both" | "none";
  maxWordLimit?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      description,
      error,
      variant = "curved",
      isFloating = false,
      labelPlacement = "top",
      labelWidth = "w-32",
      "labelAlign-X": labelAlignX,
      "labelAlign-Y": labelAlignY = "middle",
      autoResize = false,
      maxHeight,
      allowResize = "none",
      showCount = "none",
      maxWordLimit,
      className,
      onFocus,
      onBlur,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalHasContent, setInternalHasContent] = useState(
      !!props.defaultValue || !!props.value,
    );
    const [leftElementWidth, setLeftElementWidth] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const internalRef = useRef<HTMLTextAreaElement>(null);

    // Merge refs
    const setRefs = (node: HTMLTextAreaElement) => {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as any).current = node;
      (internalRef as any).current = node;
    };

    useLayoutEffect(() => {
      if (autoResize && internalRef.current) {
        internalRef.current.style.height = "auto";
        const newHeight = internalRef.current.scrollHeight;
        internalRef.current.style.height = maxHeight 
          ? `${Math.min(newHeight, parseInt(maxHeight))}px` 
          : `${newHeight}px`;
      }
    }, [props.value, internalHasContent, autoResize, maxHeight]);

    const hasValue =
      (props.value !== undefined && props.value !== "") ||
      (props.defaultValue !== undefined && props.defaultValue !== "") ||
      internalHasContent;
    const isActive = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setInternalHasContent(e.target.value !== "");
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      
      if (maxWordLimit) {
        const words = val.trim().split(/\s+/).filter(Boolean);
        if (words.length > maxWordLimit) return;
      }

      setInternalHasContent(val !== "");
      setCharCount(val.length);
      setWordCount(val.trim().split(/\s+/).filter(Boolean).length);
      
      onChange?.(e);
    };

    const isSideLabel = labelPlacement === "left" || labelPlacement === "right";

    const xAlignment =
      labelAlignX ||
      (labelPlacement === "left" ? "left" : labelPlacement === "right" ? "right" : "left");

    const yAlignmentClass =
      labelAlignY === "top" ? "items-start" : labelAlignY === "bottom" ? "items-end" : "items-center";

    const radiusClass =
      variant === "square" ? "rounded-none" : variant === "curved" ? "rounded-lg" : "rounded-full";

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
              <span className="text-sm font-medium tracking-tight text-white">{label}</span>
              {description && (
                <span className="text-xs text-gray-400 font-medium mt-0.5">{description}</span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col relative group">
          {label && isFloating && (
            <span
              className={cn(
                "absolute transition-all duration-200 pointer-events-none font-medium tracking-tight z-10 block truncate",
                isActive
                  ? "-top-4 left-6 right-auto text-sm bg-black px-1.5 text-sky-500 max-w-[calc(100%-1.5rem)]"
                  : "top-4 text-md text-gray-400 px-4 left-0 right-0",
              )}
            >
              {label}
            </span>
          )}

          <div
            className={cn(
              "relative w-full bg-black border transition-all duration-200 min-h-[40px]",
              radiusClass,
              isFocused
                ? "border-sky-500 ring-4 ring-sky-500/10 shadow-lg"
                : "border-gray-800 hover:border-gray-600",
              error ? "border-red-500 ring-4 ring-red-500/10" : "",
            )}
          >
            <textarea
              ref={setRefs}
              {...props}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={isFloating && !isActive ? "" : props.placeholder}
              style={{ resize: allowResize }}
              className={cn(
                "w-full bg-transparent border-none text-md text-white outline-none p-4",
                autoResize && "overflow-hidden",
              )}
            />

            {(showCount !== "none") && (
              <div className="absolute bottom-2 right-4 flex gap-3 pointer-events-none">
                {(showCount === "characters" || showCount === "both") && (
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {charCount}{props.maxLength ? ` / ${props.maxLength}` : ""} CHR
                  </span>
                )}
                {(showCount === "words" || showCount === "both") && (
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {wordCount}{maxWordLimit ? ` / ${maxWordLimit}` : ""} WRD
                  </span>
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

TextArea.displayName = "TextArea";
