import { cn } from "@/src/utils";
import type { GridProps } from "@/root.config";
import { getGridClass } from "../utils";

type Props = GridProps;

export const Grid = ({
  children,
  className,
  cols = 1,
  noGap,
  ...props
}: Props) => {
  return (
    <div
      className={cn("grid gap-5", getGridClass(cols), noGap && "gap-0", className)}
      {...props}
    >
      {children}
    </div>
  );
};
