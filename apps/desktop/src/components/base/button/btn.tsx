import { btnVariantMap, roundedMap, cn } from "@/src/utils";
import type { ButtonProps } from "@/root.config";
type Props = ButtonProps;
export const Btn = ({
  variant = "none",
  rounded = "none",
  className,
  children,
  type = "button",
  ...props
}: Props) => {
  return (
    <button
      type={type}
      className={cn(
        "flex items-center justify-center px-4 h-8 whitespace-nowrap gap-2 text-[14px] transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed",
        btnVariantMap[variant],
        roundedMap[rounded],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
