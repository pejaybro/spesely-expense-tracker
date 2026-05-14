import { createPortal } from "react-dom";
import { useEffect, useState, type ReactNode } from "react";

interface PotralProps {
  children: ReactNode;
}
export function Potral({ children }: PotralProps) {
  const [container] = useState(document.createElement("div"));
  useEffect(() => {
    container.id = "dynamic-portal";
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);
  return createPortal(children, container);
}
