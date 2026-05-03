import { Btn } from "@/src/components/base";
import { cn } from "@/src/utils";

export interface MenuBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  name?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MenuBtn = ({
  isActive,
  name,
  icon,
  className,
  ...props
}: MenuBtnProps) => {
  return (
    <Btn
      {...props}
      variant="menu"
      rounded="md"
      className={cn(
        "font-medium justify-center menu-btn w-auto h-auto aspect-square p-2.25",
        "md:w-full md:p-2.25 md:h-9 md:aspect-auto md:justify-start",
        isActive && "active-menu-btn",
        className,
      )}
    >
      <span>{icon}</span>
      <span className="whitespace-nowrap hidden md:block">{name}</span>
    </Btn>
  );
};
