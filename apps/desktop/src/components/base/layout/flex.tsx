import { cn } from "@/src/utils";
import type { FlexProps } from "@/root.config";
import { flexDirectionMap, itemsMap, justifyMap } from "@/src/utils";
type Props = FlexProps;

export const Flex = ({
  children,
  className,
  items = "start",
  justify = "start",
  noGap,
  direction = "row",
  wrap,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        "flex gap-5",
        flexDirectionMap[direction],
        itemsMap[items],
        justifyMap[justify],
        noGap && "gap-0",
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
