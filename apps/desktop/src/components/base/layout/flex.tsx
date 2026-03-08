import { cn } from "@/src/utils";
import type { FlexProps } from "@/root.config";
import { directionMap, itemsMap, justifyMap } from "@/src/utils";
type Props = FlexProps;

export const Flex = ({
  children,
  className,
  items = "start",
  justify = "center",
  noGap,
  direction,
}: Props) => {
  return (
    <div
      className={cn(
        "flex gap-5 bg-white",
        directionMap[direction],
        itemsMap[items],
        justifyMap[justify],
        noGap && "gap-0",
        className,
      )}
    >
      {children}
    </div>
  );
};
