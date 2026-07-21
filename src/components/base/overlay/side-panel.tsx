import type { ReactNode } from "react";
import { Backdrop } from "./backdrop";
import { type Provider as Props } from "@/root.config";
import { Portal } from "..";

interface SidePanelBaseProps {
  children?: ReactNode | string;
  onClose?: () => void;
  options: Props.BaseProps["options"];
}

export function SidePanel({ children, onClose, options }: SidePanelBaseProps) {
  const justify = options?.onSide === "left" ? "start" : "end";
  return (
    <>
      <Portal>
        <Backdrop justify={justify} onClose={() => onClose?.()}>
          <div className="relative z-10000">{children}</div>
        </Backdrop>
      </Portal>
    </>
  );
}