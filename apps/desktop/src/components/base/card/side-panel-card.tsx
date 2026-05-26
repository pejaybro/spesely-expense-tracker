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
}
export function SidePanelCard({
  children,
  title,
  description,
  className,
  close,
}: Props) {
  return (
    <Flex
      direction="column"
      className={cn(
        " bg-white min-h-screen min-w-10 overflow-hidden",
        className,
      )}
    >
      <Flex
        direction="row"
        items="center"
        justify="between"
        className="w-full p-4 border-b"
      >
        <Flex direction="column">
          {title && <span className="font-semibold">{title}</span>}
          {description && <span>{description}</span>}
        </Flex>
        <Btn variant="solid-icon" rounded="full" onClick={close}>
          <X strokeWidth={2.5} />
        </Btn>
      </Flex>

      <Flex direction="row" className="min-h-0 w-auto overflow-y-auto p-4">
        {children}
      </Flex>
    </Flex>
  );
}