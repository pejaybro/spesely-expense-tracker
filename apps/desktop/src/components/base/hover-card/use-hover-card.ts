import { useState, useEffect } from "react";
import {
  useFloating,
  autoUpdate,
  offset as offsetMiddleware,
  flip,
  shift,
  useHover,
  useInteractions,
  safePolygon,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";
import { useContextMenuStore } from "../context-menu/store";

export interface UseHoverCardOptions {
  /** Where the card appears relative to the trigger. Auto-flips if no space. */
  placement?: Placement;
  /** Delay (ms) before the card opens after mouse enters the trigger. */
  openDelay?: number;
  /** Delay (ms) before the card closes after mouse leaves. */
  closeDelay?: number;
  /** Gap (px) between the trigger element and the card edge. */
  offset?: number;
  /** When true, the card will never open regardless of hover. */
  disabled?: boolean;
}

export function useHoverCard({
  placement = "top",
  openDelay = 300,
  closeDelay = 150,
  offset = 8,
  disabled = false,
}: UseHoverCardOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (disabled) return;

      // If the mouse leaves but the context menu is open, keep the hover card open
      if (!open && useContextMenuStore.getState().isOpen) {
        return;
      }

      setIsOpen(open);
    },
    placement,
    middleware: [
      offsetMiddleware(offset),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: openDelay, close: closeDelay },
    // safePolygon keeps the card open while cursor moves into it
    handleClose: safePolygon(),
    enabled: !disabled,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  // If the context menu closes, also close the hover card (unless clicked inside this card)
  useEffect(() => {
    if (!isOpen) return;

    let lastClickTarget: HTMLElement | null = null;

    const handleWindowMouseDown = (e: MouseEvent) => {
      lastClickTarget = e.target as HTMLElement;
    };

    window.addEventListener("mousedown", handleWindowMouseDown, true);

    const unsubscribe = useContextMenuStore.subscribe((state) => {
      if (!state.isOpen) {
        const floatEl = refs.floating.current;
        const refEl = refs.reference.current;

        // If a click occurred, check if it was inside our hover card or trigger element
        const clickedInside =
          lastClickTarget &&
          (floatEl?.contains(lastClickTarget) ||
            (refEl instanceof Element && refEl.contains(lastClickTarget)));

        if (!clickedInside) {
          setIsOpen(false);
        }
      }
    });

    return () => {
      window.removeEventListener("mousedown", handleWindowMouseDown, true);
      unsubscribe();
    };
  }, [isOpen, refs.floating, refs.reference]);

  return {
    refs,
    floatingStyles,
    isOpen: isOpen && !disabled,
    getReferenceProps,
    getFloatingProps,
  };
}
