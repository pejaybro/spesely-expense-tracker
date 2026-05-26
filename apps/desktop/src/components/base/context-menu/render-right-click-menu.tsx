import { useState, useEffect } from "react";
import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/react";
import { useContextMenuStore } from "./store";
import { Portal } from "../overlay/portal";
import { cn } from "@/src/utils";
import type { ContextMenuItem } from "./types";

function SubMenuItem({ item, close }: { item: ContextMenuItem; close: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "right-start",
    middleware: [
      offset({ mainAxis: 4, crossAxis: -4 }),
      flip({ fallbackPlacements: ["left-start"] }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <div
      ref={refs.setReference}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="relative"
    >
      <div
        className={cn(
          "hover:bg-gray-100 active:bg-gray-200 px-3 py-2 rounded text-gray-700 text-sm cursor-pointer flex justify-between items-center",
          item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent active:bg-transparent",
          isOpen && "bg-gray-100",
        )}
      >
        <span>{item.label}</span>
        <span className="text-xs text-gray-400">&gt;</span>
      </div>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-[10000] bg-white shadow-lg p-1 border border-gray-200 rounded-md min-w-[180px]"
        >
          {item.children?.map((child) => (
            <div
              key={child.id}
              onClick={(e) => {
                e.stopPropagation();
                if (child.disabled) return;
                child.onClick?.();
                close();
              }}
              className={cn(
                "rounded px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                child.disabled && "cursor-not-allowed text-gray-400 hover:bg-transparent",
              )}
            >
              {child.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RenderRightClickMenu() {
  const { isOpen, x, y, items, close } = useContextMenuStore();

  const { refs, floatingStyles, update } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(0),
      flip({
        fallbackPlacements: ["bottom-end", "top-start", "top-end"],
      }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (isOpen) {
      refs.setReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: x,
            y: y,
            top: y,
            left: x,
            right: x,
            bottom: y,
          };
        },
      });
      update();
    }
  }, [isOpen, x, y, refs, update]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="z-[9999] bg-white shadow-lg p-1 border border-gray-200 rounded-md min-w-[180px]"
      >
        {items.map((item) => {
          if (item.children?.length) {
            return <SubMenuItem key={item.id} item={item} close={close} />;
          }

          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.disabled) return;
                item.onClick?.();
                close();
              }}
              className={cn(
                "hover:bg-gray-100 active:bg-gray-200 px-3 py-2 rounded text-gray-700 text-sm cursor-pointer",
                item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent active:bg-transparent",
              )}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </Portal>
  );
}