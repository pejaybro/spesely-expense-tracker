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
}
export function ModalCard({
  children,
  title,
  description,
  footer,
  className,
  close,
}: Props) {
  return (
    <Flex
      direction="column"
      className={cn(
        " bg-white max-h-[90vh] max-w-[90vw] rounded-xl overflow-hidden",
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

      <div className="w-full min-w-0 overflow-auto p-4">{children}</div>

      <div className="flex justify-end w-full p-4 border-t">{footer}</div>
    </Flex>
  );
}