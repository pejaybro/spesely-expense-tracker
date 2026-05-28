import React, { useEffect } from "react";
import type { FlexProps } from "@/root.config";
import { Flex } from "../layout/flex";

interface BackdropProps {
  children?: React.ReactNode;
  onClose?: () => void;
  justify?: FlexProps["justify"];
  items?: FlexProps["items"];
  direction?: FlexProps["direction"];
}

export function Backdrop({
  children,
  onClose,
  justify,
  items,
  direction,
}: BackdropProps) {
  
  useEffect(() => {
    // 1. Lock body scrolling on mount
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 2. Escape key accessibility handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup: restore scrolling and remove keydown handler
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      {/* Self-contained premium transitions */}
      <style>{`
        @keyframes backdropFadeIn {
          from { 
            opacity: 0; 
            backdrop-filter: blur(0px); 
          }
          to { 
            opacity: 1; 
            backdrop-filter: blur(1px); 
          }
        }
        .animate-backdrop-fade {
          animation: backdropFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <Flex
        direction={direction || "row"}
        items={items || "center"}
        justify={justify || "center"}
        className="inset-0 fixed z-9999 overflow-hidden"
      >
        {/* Animated dark overlay background */}
        <div
          onClick={() => onClose?.()}
          className="absolute inset-0 bg-black/50 animate-backdrop-fade cursor-pointer"
        />
        
        {/* Child content container */}
        <div className="relative z-10">
          {children}
        </div>
      </Flex>
    </>
  );
}
