import { Btn, Tooltip } from "@/src/components/base";
import { cn } from "@/src/utils";

export interface MenuBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  name?: string;
  icon?: React.ReactNode;
  className?: string;
  isMenuExpanded?: boolean;
  content?: string;
}

export const MenuBtn = ({
  isActive,
  name,
  icon,
  className,
  isMenuExpanded = false,
  content,
  ...props
}: MenuBtnProps) => {
  return (
    <Btn
      {...props}
      variant="menu"
      rounded="md"
      className={cn(
        "font-medium w-full menu-btn",
        // Logic is now simple: if expanded, show full button. If not, show square icon.
        isMenuExpanded
          ? "justify-start p-2.25 h-9 aspect-auto"
          : "justify-center w-auto h-auto aspect-square p-2.25",
        isActive && "active-menu-btn",
        className,
      )}
    >
      <span>{icon}</span>
      <span
        className={cn("whitespace-nowrap", isMenuExpanded ? "block" : "hidden")}
      >
        {name}
      </span>
    </Btn>
  );
};
