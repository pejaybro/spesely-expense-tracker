import { X } from "lucide-react";
import { Btn } from "../button";
import { Flex } from "../layout";
import { cn } from "@/src/utils";

interface Props {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  close?: () => void;
  /** CSS size string e.g. "380px" | "40vw". Defaults to auto with min 280px floor. */
  width?: string;
  /** CSS size string e.g. "600px" | "80vh". Defaults to full screen height. */
  height?: string;
}

export function SidePanelCard({
  children,
  title,
  description,
  className,
  close,
  width,
  height,
}: Props) {
  return (
    <Flex
      direction="column"
      className={cn(
        "bg-white overflow-hidden",
        // Width: min floor, no hard max (allow consumer to set via prop)
        "min-w-[280px]",
        // Height: full screen by default unless overridden
        !height && "min-h-screen",
        !width && "w-auto",
        className,
      )}
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <Flex
        direction="row"
        items="center"
        justify="between"
        className="w-full p-4 border-b shrink-0"
      >
        <Flex direction="column">
          {title && <span className="font-semibold">{title}</span>}
          {description && (
            <span className="text-sm opacity-60">{description}</span>
          )}
        </Flex>
        <Btn variant="solid-icon" rounded="full" onClick={close}>
          <X strokeWidth={2.5} />
        </Btn>
      </Flex>

      {/* ── Scrollable body ────────────────────────────────────── */}
      <Flex direction="row" className="min-h-0 flex-1 w-full overflow-y-auto p-4">
        {children}
      </Flex>
    </Flex>
  );
}