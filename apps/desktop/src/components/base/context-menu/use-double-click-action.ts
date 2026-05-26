import { useEffect, useRef } from "react";
import { doubleClickRegistry, type DoubleClickActionPayload } from "./double-click-registry";

export function useDoubleClickAction(
  actionId: string,
  payload: DoubleClickActionPayload
) {
  const ref = useRef<HTMLButtonElement | HTMLDivElement | HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleDblClick = (e: Event) => {
      e.preventDefault();
      const action = doubleClickRegistry[actionId];
      if (action) {
        action.run(el, payload);
      }
    };

    el.addEventListener("dblclick", handleDblClick);
    return () => {
      el.removeEventListener("dblclick", handleDblClick);
    };
  }, [actionId, payload.value, payload.label]);

  return ref;
}
