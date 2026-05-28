import { type CSSProperties, type ReactNode } from "react";
import { FloatingPortal } from "@floating-ui/react";
import { cn } from "@/src/utils";
import { useHoverCard, type UseHoverCardOptions } from "./use-hover-card";

// Max dimensions applied when no explicit size is passed
const MAX_WIDTH = 320;
const MAX_HEIGHT = 400;

export interface HoverCardProps extends UseHoverCardOptions {
  /**
   * The trigger element.
   */
  children: ReactNode;
  /** Arbitrary JSX rendered inside the card. Pass your own component here. */
  content: ReactNode;
  /**
   * Explicit card width in px. If omitted the card auto-sizes up to MAX_WIDTH.
   */
  width?: number;
  /**
   * Explicit card height in px. If omitted the card auto-sizes up to MAX_HEIGHT.
   * When content overflows the set (or max) height, the inner area scrolls.
   */
  height?: number;
  /** Extra classes applied to the card wrapper. */
  className?: string;
}

export function HoverCard({
  children,
  content,
  placement = "top",
  openDelay = 300,
  closeDelay = 150,
  offset = 8,
  disabled,
  width,
  height,
  className,
}: HoverCardProps) {
  const { refs, floatingStyles, isOpen, getReferenceProps, getFloatingProps } =
    useHoverCard({ placement, openDelay, closeDelay, offset, disabled });

  // Explicit dimensions take precedence; otherwise clamp with max values
  const wrapperStyle: CSSProperties = {
    ...floatingStyles,
    ...(width !== undefined ? { width } : { maxWidth: MAX_WIDTH }),
    ...(height !== undefined ? { height } : { maxHeight: MAX_HEIGHT }),
  };

  return (
    <>
      {/* w-fit div ensures the wrapper has a correct layout box matching the child */}
      <div ref={refs.setReference} {...getReferenceProps()} className="w-fit inline-block">
        {children}
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={wrapperStyle}
            {...getFloatingProps()}
            className={cn(
              "z-[9999] rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl",
              className,
            )}
          >
            {/*
              Inner scroll container:
              - overflows only when content exceeds the explicit or max size
              - full width/height of the wrapper so padding is handled by
                the consumer's content component
              - holds the hover-card-enter animation to avoid overriding Floating UI's transform
            */}
            <div className="w-full h-full overflow-auto hover-card-enter">
              {content}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
