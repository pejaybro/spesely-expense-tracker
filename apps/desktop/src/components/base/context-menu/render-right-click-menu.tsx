import { useState, useEffect } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useInteractions,
  safePolygon,
  FloatingTree,
  FloatingNode,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
} from "@floating-ui/react";
import { ChevronRight } from "lucide-react";
import { useContextMenuStore } from "./store";
import { Portal } from "../overlay/portal";
import { cn } from "@/src/utils";
import type { ContextMenuItem } from "./types";

// ─── Shared item classes (shadcn style) ─────────────────────────────────────
const itemBase =
  "relative flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm outline-none cursor-default select-none transition-colors duration-100";
const itemActive = "bg-zinc-800 text-white";
const itemDisabled = "text-zinc-600 pointer-events-none opacity-50";

function SubMenuItem({
  item,
  close,
}: {
  item: ContextMenuItem;
  close: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const tree = useFloatingTree();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      setIsOpen(open);
      // Close sibling submenus when this node opens
      if (open && tree) {
        tree.events.emit("close", { id: nodeId, parentId });
      }
    },
    nodeId,
    placement: "right-start",
    middleware: [
      offset({ mainAxis: 4, crossAxis: -4 }),
      flip({ fallbackPlacements: ["left-start"] }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: 50, close: 100 },
    handleClose: safePolygon({ blockPointerEvents: true }),
    restMs: 25,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  // Handle tree-level closing events to close nested submenus cleanly
  useEffect(() => {
    if (!tree) return;
    const handleClose = (payload: { id: string; parentId: string }) => {
      if (payload.parentId === parentId && payload.id !== nodeId) {
        setIsOpen(false);
      }
    };
    tree.events.on("close", handleClose);
    return () => {
      tree.events.off("close", handleClose);
    };
  }, [tree, nodeId, parentId]);

  return (
    <FloatingNode id={nodeId}>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={cn(itemBase, isOpen ? itemActive : "hover:bg-zinc-800", item.disabled && itemDisabled, "text-zinc-100")}
      >
        <span>{item.label}</span>
        <span className="flex items-center gap-1 text-zinc-400">
          {item.icon}
          <ChevronRight size={14} />
        </span>
      </div>

      {isOpen && (
        <Portal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-[10000] min-w-[160px] overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 p-1 shadow-md"
          >
            {item.children?.map((child) => {
              if (child.children?.length) {
                return <SubMenuItem key={child.id} item={child} close={close} />;
              }

              return (
                <div
                  key={child.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (child.disabled) return;
                    child.onClick?.();
                    close();
                  }}
                  className={cn(itemBase, "hover:bg-zinc-800 text-zinc-100", child.disabled && itemDisabled)}
                >
                  <span>{child.label}</span>
                  {child.icon && <span className="text-zinc-500">{child.icon}</span>}
                </div>
              );
            })}
          </div>
        </Portal>
      )}
    </FloatingNode>
  );
}


// ─── Root menu content (nested inside FloatingTree) ─────────────────────────
function MainMenuContent() {
  const { isOpen, x, y, items, close } = useContextMenuStore();
  const tree = useFloatingTree();

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(0),
      flip({ fallbackPlacements: ["bottom-end", "top-start", "top-end"] }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });



  useEffect(() => {
    if (isOpen) {
      refs.setReference({
        getBoundingClientRect() {
          return { width: 0, height: 0, x, y, top: y, left: x, right: x, bottom: y };
        },
      });
    }
  }, [isOpen, x, y, refs]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className="z-[9999] min-w-[180px] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-xl"
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
              className={cn(itemBase, "hover:bg-zinc-800 text-zinc-100", item.disabled && itemDisabled)}
            >
              <span>{item.label}</span>
              {item.icon && <span className="text-zinc-500">{item.icon}</span>}
            </div>
          );
        })}
      </div>
    </Portal>
  );
}

export function RenderRightClickMenu() {
  const isOpen = useContextMenuStore((s) => s.isOpen);
  if (!isOpen) return null;

  return (
    <FloatingTree>
      <MainMenuContent />
    </FloatingTree>
  );
}