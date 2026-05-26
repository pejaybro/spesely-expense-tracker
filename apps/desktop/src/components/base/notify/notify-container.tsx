import { useEffect, useState } from "react";
import type { NotifyItem } from "./types";
import { subscribe } from "./store";
import { notifyPositionClasses } from "./constants";
import { cn } from "@/src/utils";
import { NotifyCard } from "./notify-card";
import { Portal } from "../overlay/portal";

export function NotifyContainer() {
  const [item, setItem] = useState<NotifyItem | null>(null);
  const [visible, setVisible] = useState(false);
  const [renderItem, setRenderItem] = useState<NotifyItem | null>(null);

  useEffect(() => {
    return subscribe(setItem);
  }, []);

  useEffect(() => {
    if (item) {
      setRenderItem(item);

      requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(false);

      const timeout = setTimeout(() => {
        setRenderItem(null);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [item]);

  if (!renderItem) return null;

  return (
    <Portal>
      <div
        key={renderItem.id}
        className={cn(
          "z-[9999] fixed transition-all duration-300",
          visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
          notifyPositionClasses[renderItem.position || "top-center"],
        )}
      >
        <NotifyCard item={renderItem} />
      </div>
    </Portal>
  );
}