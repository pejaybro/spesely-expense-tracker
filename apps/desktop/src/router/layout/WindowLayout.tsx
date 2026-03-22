import { WindowTitleBar } from "@/src/components/electron";
import { Flex } from "@/src/components/base";
import type { ReactNode } from "react";

interface WindowLayoutProps {
  children: ReactNode;
}

export const WindowLayout = ({ children }: WindowLayoutProps) => {
  return (
    <Flex
      direction="column"
      className="p-0 bg-black min-h-screen h-screen w-full text-pure-white overflow-hidden gap-0"
    >
      <WindowTitleBar />
      {children}
    </Flex>
  );
};
