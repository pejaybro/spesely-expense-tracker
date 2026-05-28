import React, { useState, useRef, useEffect } from "react";
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  size,
  offset,
  FloatingPortal,
} from "@floating-ui/react";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/src/utils";
import { Tooltip } from "../button/tooltip";
import { type SelectOption } from "./select-input";

export interface MultiSelectInputProps {
  /** Array of option objects: { id, label, key } */
  options: SelectOption[];
  /** Controlled array of selected keys */
  value?: string[];
  /** Callback triggered when the selection changes */
  onChange?: (keys: string[], selectedOptions: SelectOption[]) => void;
  /** Optional placeholder if no options are selected */
  placeholder?: string;
  /** Optional icon rendered on the left of the button trigger */
  prefixIcon?: React.ReactNode;
  /** Display mode: 'count' (e.g. "3 selected") or 'chips' (individual tags) */
  displayMode?: "count" | "chips";
  /** Custom class name for the wrapper */
  className?: string;
  /** Custom width for the button trigger (e.g. 'w-64', 'w-full') */
  width?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Show full selected value in a tooltip on hover */
  showTooltip?: boolean;
}

// A helper component to conditionally display a tooltip only if the wrapped child is truncated
function TruncatedTooltip({
  content,
  children,
  enabled,
}: {
  content: string;
  children: React.ReactElement<any>;
  enabled: boolean;
}) {
  const [isTruncated, setIsTruncated] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const checkTruncation = () => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    setIsTruncated(el.scrollWidth > el.clientWidth);
  };

  const trigger = React.cloneElement(children, {
    ref,
    onMouseEnter: (e: React.MouseEvent) => {
      checkTruncation();
      children.props.onMouseEnter?.(e);
    },
  });

  return (
    <Tooltip content={content} disabled={!enabled || !isTruncated}>
      {trigger}
    </Tooltip>
  );
}

export function MultiSelectInput({
  options = [],
  value: controlledValue,
  onChange,
  placeholder = "Select...",
  prefixIcon,
  displayMode = "count",
  className,
  width = "w-full",
  disabled = false,
  showTooltip = false,
}: MultiSelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Uncontrolled fallback state
  const [localValue, setLocalValue] = useState<string[]>([]);

  const activeValue =
    controlledValue !== undefined ? controlledValue : localValue;

  // Selected option objects
  const selectedOptions = options.filter(opt => activeValue.includes(opt.key));

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 1. Setup Floating UI
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
        padding: 8,
      }),
    ],
  });

  // Highlight first selected item or index 0 on open
  useEffect(() => {
    if (isOpen && options.length > 0) {
      if (activeValue.length > 0) {
        const lastSelectedKey = activeValue[activeValue.length - 1];
        const lastSelectedIdx = options.findIndex(
          opt => opt.key === lastSelectedKey,
        );
        setHighlightedIndex(lastSelectedIdx >= 0 ? lastSelectedIdx : 0);
      } else {
        setHighlightedIndex(0);
      }
    }
  }, [isOpen, activeValue, options]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
    const itemEl = listRef.current.children[highlightedIndex] as HTMLElement;
    if (itemEl) {
      itemEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedIndex, isOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        refs.floating.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refs.floating]);

  const toggleOption = (opt: SelectOption) => {
    let nextValue: string[];
    if (activeValue.includes(opt.key)) {
      nextValue = activeValue.filter(val => val !== opt.key);
    } else {
      nextValue = [...activeValue, opt.key];
    }

    if (controlledValue === undefined) {
      setLocalValue(nextValue);
    }
    const nextOptions = options.filter(o => nextValue.includes(o.key));
    onChange?.(nextValue, nextOptions);
  };

  const removeOptionKey = (keyToRemove: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextValue = activeValue.filter(val => val !== keyToRemove);
    if (controlledValue === undefined) {
      setLocalValue(nextValue);
    }
    const nextOptions = options.filter(o => nextValue.includes(o.key));
    onChange?.(nextValue, nextOptions);
  };

  const typeBufferRef = useRef("");
  const typeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (
        e.key === "Enter" ||
        e.key === " " ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp"
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    // Typeahead matching: single character keystrokes accumulate to select/navigate options
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      typeBufferRef.current += e.key.toLowerCase();

      const matchIndex = options.findIndex(opt =>
        opt.label.toLowerCase().startsWith(typeBufferRef.current),
      );

      if (matchIndex !== -1) {
        setHighlightedIndex(matchIndex);
      }

      if (typeTimeoutRef.current) {
        clearTimeout(typeTimeoutRef.current);
      }

      typeTimeoutRef.current = setTimeout(() => {
        typeBufferRef.current = "";
      }, 500);

      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          toggleOption(options[highlightedIndex]);
        }
        break;
      case "Backspace":
        // In chips mode, pressing backspace deletes the last selected chip
        if (displayMode === "chips" && activeValue.length > 0) {
          e.preventDefault();
          removeOptionKey(activeValue[activeValue.length - 1]);
        }
        break;
      case "Escape":
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", width, className)}
    >
      <div
        ref={refs.setReference}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "flex items-center justify-between rounded-lg border text-sm select-none cursor-pointer outline-none transition-all duration-150 min-h-[42px]",
          "bg-black border-gray-800 text-white hover:border-gray-600 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10",
          disabled && "opacity-50 pointer-events-none cursor-not-allowed border-zinc-900"
        )}
      >
        {/* Left Prefix Icon Area */}
        {prefixIcon && (
          <div className="flex items-center pl-3 text-zinc-400 shrink-0 self-stretch min-h-[42px]">
            {prefixIcon}
          </div>
        )}

        {/* Central Content Area */}
        <div
          className={cn(
            "flex min-w-0 flex-1 px-3 py-2",
            displayMode === "chips" && selectedOptions.length > 0
              ? "flex-col gap-1.5 items-start"
              : "flex-row items-center gap-2"
          )}
        >
          {/* Header container for icon & count */}
          {selectedOptions.length > 0 && displayMode === "chips" && (
            <div className="flex items-center gap-1.5 shrink-0 select-none text-gray-400">
              <span className="text-zinc-500 text-xs font-medium">
                selected ({selectedOptions.length})
              </span>
            </div>
          )}

          {/* Chips Display Mode */}
          {displayMode === "chips" && selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1 flex-1 w-full">
              {selectedOptions.map((opt) => (
                <div
                  key={opt.key}
                  className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-zinc-200 px-2 py-0.5 rounded-md text-xs shrink-0 hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <TruncatedTooltip content={opt.label} enabled={showTooltip}>
                    <span className="truncate max-w-[80px] block">{opt.label}</span>
                  </TruncatedTooltip>
                  <button
                    onClick={(e) => removeOptionKey(opt.key, e)}
                    className="text-zinc-500 hover:text-white shrink-0 outline-none"
                    tabIndex={-1}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <TruncatedTooltip
              content={selectedOptions.map((o) => o.label).join(", ")}
              enabled={showTooltip && selectedOptions.length > 0}
            >
              <span className="truncate text-zinc-100 flex-1 text-left">
                {selectedOptions.length > 0
                  ? `${selectedOptions.length} selected`
                  : placeholder}
              </span>
            </TruncatedTooltip>
          )}
        </div>

        {/* Right Caret Icon Area */}
        <div className="flex items-center pr-3 pl-1 text-zinc-400 shrink-0 self-stretch min-h-[42px]">
          <ChevronDown
            size={16}
            className={cn(
              "transition-transform duration-200",
              isOpen && "rotate-180 text-white"
            )}
          />
        </div>
      </div>

      {/* Portal Dropdown Menu */}
      {isOpen && options.length > 0 && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-[9999] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-2xl"
          >
            <div
              ref={listRef}
              className="max-h-60 overflow-y-auto flex flex-col gap-0.5 no-scrollbar"
            >
              {options.map((item, index) => {
                const isSelected = activeValue.includes(item.key);
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleOption(item)}
                    className={cn(
                      "flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm select-none cursor-pointer transition-colors duration-75",
                      isSelected && "text-sky-400 font-medium bg-zinc-900/60",
                      isHighlighted && !isSelected && "bg-zinc-900 text-white",
                      !isHighlighted &&
                        !isSelected &&
                        "text-zinc-300 hover:bg-zinc-900/40 hover:text-white",
                    )}
                  >
                    <span className="flex-1 whitespace-normal break-words text-left">
                      {item.label}
                    </span>

                    {/* Check icon for selected value */}
                    {isSelected && (
                      <Check size={14} className="text-sky-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}
