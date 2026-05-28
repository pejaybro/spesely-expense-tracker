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
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/src/utils";
import { Tooltip } from "../button/tooltip";

export interface SelectOption {
  id: string;
  label: string;
  key: string;
}

export interface SelectInputProps {
  /** Array of option objects: { id, label, key } */
  options: SelectOption[];
  /** Controlled value (key). If undefined, component runs in uncontrolled mode */
  value?: string;
  /** Callback triggered when a new option is selected */
  onChange?: (key: string, option: SelectOption) => void;
  /** Optional placeholder if no option is selected (though by default first is selected) */
  placeholder?: string;
  /** Optional icon rendered on the left of the select button trigger */
  prefixIcon?: React.ReactNode;
  /** Custom class name for the wrapper */
  className?: string;
  /** Custom width for the button (e.g. 'w-64', 'w-full') */
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

export function SelectInput({
  options = [],
  value: controlledValue,
  onChange,
  placeholder = "Select...",
  prefixIcon,
  className,
  width = "w-full",
  disabled = false,
  showTooltip = false,
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Uncontrolled fallback state
  const [localValue, setLocalValue] = useState<string>(() => {
    return options.length > 0 ? options[0].key : "";
  });

  const activeValue = controlledValue !== undefined ? controlledValue : localValue;

  // Find currently selected option
  const selectedOption = options.find((opt) => opt.key === activeValue);

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

  // Automatically highlight selected option when dropdown opens
  useEffect(() => {
    if (isOpen && options.length > 0) {
      const selectedIdx = options.findIndex((opt) => opt.key === activeValue);
      setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
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

  const selectOption = (opt: SelectOption) => {
    if (controlledValue === undefined) {
      setLocalValue(opt.key);
    }
    onChange?.(opt.key, opt);
    setIsOpen(false);
  };

  const typeBufferRef = useRef("");
  const typeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    // Typeahead matching: when open, single character keystrokes accumulate to select options
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      typeBufferRef.current += e.key.toLowerCase();

      const matchIndex = options.findIndex((opt) =>
        opt.label.toLowerCase().startsWith(typeBufferRef.current)
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
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          selectOption(options[highlightedIndex]);
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
      {/* Trigger Button */}
      <div
        ref={refs.setReference}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "flex items-center justify-between rounded-lg border text-sm select-none cursor-pointer outline-none transition-all duration-150 h-[42px]",
          "bg-black border-gray-800 text-white hover:border-gray-600 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10",
          disabled && "opacity-50 pointer-events-none cursor-not-allowed border-zinc-900"
        )}
      >
        {/* Left Prefix Icon Area */}
        {prefixIcon && (
          <div className="flex items-center pl-3 text-zinc-400 shrink-0 h-full">
            {prefixIcon}
          </div>
        )}

        {/* Central Content Area */}
        <div className="flex items-center min-w-0 flex-1 px-3 py-2.5 h-full">
          <TruncatedTooltip content={selectedOption?.label || ""} enabled={showTooltip && !!selectedOption}>
            <span className="truncate text-zinc-100 flex-1 text-left min-w-0">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </TruncatedTooltip>
        </div>

        {/* Right Caret Icon Area */}
        <div className="flex items-center pr-3 pl-1 text-zinc-400 shrink-0 h-full">
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
                const isSelected = item.key === activeValue;
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => selectOption(item)}
                    className={cn(
                      "flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm select-none cursor-pointer transition-colors duration-75",
                      // Selected value changes color to a highlight look
                      isSelected && "text-sky-400 font-medium bg-zinc-900/60",
                      isHighlighted && !isSelected && "bg-zinc-900 text-white",
                      !isHighlighted && !isSelected && "text-zinc-300 hover:bg-zinc-900/40 hover:text-white"
                    )}
                  >
                    {/* Non-truncating, wrapping text */}
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
