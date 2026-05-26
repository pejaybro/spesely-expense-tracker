import { dismiss } from "./store";
import type { NotifyItem } from "./types";
import { notifyVariantClasses } from "./constants";
import { cn } from "@/src/utils";

interface NotifyCardProps {
  item: NotifyItem;
}

export function NotifyCard({ item }: NotifyCardProps) {
  return (
    <div
      className={cn(
        "shadow-xl p-4 border rounded-xl min-w-[320px]",
        notifyVariantClasses[item?.variant || "default"],
      )}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          {item.title && <h3 className="font-semibold">{item.title}</h3>}

          {item.description && (
            <p className="text-neutral-500 text-sm">{item.description}</p>
          )}
        </div>

        <button onClick={() => dismiss()}>✕</button>
      </div>
    </div>
  );
}