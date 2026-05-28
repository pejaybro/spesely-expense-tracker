import { X } from "lucide-react";
import { Btn } from "../button";
import { Flex } from "../layout";
import { cn } from "@/src/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  close?: () => void;
  /** CSS size string e.g. "480px" | "60vw". Defaults to auto (capped at 90vw). */
  width?: string;
  /** CSS size string e.g. "560px" | "80vh". Defaults to auto (capped at 90vh). */
  height?: string;
}

export function ModalCard({
  children,
  title,
  description,
  footer,
  className,
  close,
  width,
  height,
}: Props) {
  return (
    <Flex
      direction="column"
      className={cn(
        "bg-white rounded-xl overflow-hidden",
        // Responsive constraints — min floor + max ceiling
        "min-w-[320px] min-h-[200px]",
        !width && "max-w-[90vw]",
        !height && "max-h-[90vh]",
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
          {description && <span className="text-sm opacity-60">{description}</span>}
        </Flex>
        <Btn variant="solid-icon" rounded="full" onClick={close}>
          <X strokeWidth={2.5} />
        </Btn>
      </Flex>

      {/* ── Scrollable body ────────────────────────────────────── */}
      <div className="w-full min-w-0 flex-1 overflow-auto p-4">{children}</div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      {footer && (
        <div className="flex justify-end w-full p-4 border-t shrink-0">
          {footer}
        </div>
      )}
    </Flex>
  );
}