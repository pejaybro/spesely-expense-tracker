import type { ReactNode } from "react";
import { Flex } from "../layout";

interface BackdropProps {
  children?: ReactNode;
  onClose?: () => void;
  justify?: "start" | "end" | "center";
  onSide?: "left" | "right";
}

export function Backdrop({
  children,
  onClose,
  justify = "center",
}: BackdropProps) {
  return (
    <Flex
      items="center"
      justify={justify}
      noGap
      className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </Flex>
  );
}
