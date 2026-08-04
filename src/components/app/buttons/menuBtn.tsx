import { Button } from "@/src/components/base";
import { cn } from "@/src/utils";

export interface MenuBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  name?: string;
  icon?: React.ReactNode;
  className?: string;
  isMenuExpanded?: boolean;
  tooltipContent?: string | null;
}

export const MenuBtn = ({
  isActive,
  name,
  icon,
  className,
  isMenuExpanded = false,
  tooltipContent,
  ...props
}: MenuBtnProps) => {
  return (
    <Button
      {...props}
      tooltipContent={tooltipContent}
      tooltipDirection="right"
      variant="custom"
      rounded="md"
      className={cn(
        "font-medium menu-btn gap-0",
        isMenuExpanded
          ? "justify-start w-full gap-2 p-2.25 h-9 aspect-auto"
          : "justify-center w-auto h-auto aspect-square p-2.25",
        isActive && "active-menu-btn",
        className,
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {isMenuExpanded && <span className="whitespace-nowrap">{name}</span>}
    </Button>
  );
};
