import { btnVariantMap, roudedMap, cn } from "@/src/utils";
import type { ButtonProps } from "@/root.config";
type Props = ButtonProps;
export const Btn = ({
  variant,
  rounded = "none",
  className,
  children,
  onClick,
}: Props) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center h-8 whitespace-nowrap gap-2 text-[14px] transition-colors duration-200",
        btnVariantMap[variant],
        roudedMap[rounded],
        rounded !== "full" && "px-4",
        rounded === "full" && "h-auto size-5",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
