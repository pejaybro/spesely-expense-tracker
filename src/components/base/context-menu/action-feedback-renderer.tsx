import { useEffect } from "react";
import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/react";
import { useActionFeedbackStore } from "./action-feedback-store";
import { Portal } from "..";

export function RenderActionFeedback() {
  const { isOpen, x, y, label } = useActionFeedbackStore();

  const { refs, floatingStyles, update } = useFloating({
    placement: "top",
    middleware: [
      offset(8),
      flip({ fallbackPlacements: ["bottom", "top-start", "top-end"] }),
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
      if (update) update();
    }
  }, [isOpen, x, y, refs, update]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          animation: "fadeInOut 1s ease-in-out forwards",
        }}
        className="z-[10001] pointer-events-none select-none rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-xs font-medium text-white shadow-md"
      >
        {label}
      </div>
    </Portal>
  );
}
