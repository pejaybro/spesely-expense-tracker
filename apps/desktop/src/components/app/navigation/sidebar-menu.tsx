import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button, Tooltip } from "@/src/components/base";
import { MenuBtn } from "@/src/components/app";
import { cn } from "@/src/utils";

export interface MenuItem {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  link?: string;
  divider?: boolean;
  children?: { id: string | number; label: string; link: string; icon?: React.ReactNode }[];
}

export interface MenuGroup {
  id: string | number;
  type: "group";
  label: string;
  divider?: boolean;
  items: MenuItem[];
}

export interface MenuStandalone {
  id: string | number;
  type: "item";
  label: string;
  icon?: React.ReactNode;
  link: string;
  divider?: boolean;
}

export interface MenuBottom {
  id: string | number;
  type: "bottom";
  divider?: boolean;
  items: MenuItem[];
}

export type MenuConfigElement = MenuGroup | MenuStandalone | MenuBottom;

export interface SidebarMenuProps {
  config: MenuConfigElement[];
  isExpanded: boolean;
  onItemClick?: () => void;
  tooltipsDisabled?: boolean;
}

export const SidebarMenu = ({ config, isExpanded, onItemClick, tooltipsDisabled = false }: SidebarMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [delayedCollapsed, setDelayedCollapsed] = useState(!isExpanded);

  useEffect(() => {
    if (!isExpanded) {
      // Delay enabling tooltips when collapsing to match/allow visual transitions
      const timer = setTimeout(() => {
        setDelayedCollapsed(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Immediately disable tooltips when expanding
      setDelayedCollapsed(false);
    }
  }, [isExpanded]);

  useEffect(() => {
    const newExpanded: Record<string, boolean> = {};

    config.forEach(section => {
      const items =
        section.type === "group" || section.type === "bottom"
          ? section.items
          : [section as any];
      items.forEach(item => {
        if (item.children) {
          const isChildActive = item.children.some(
            (child: any) => location.pathname === child.link
          );
          newExpanded[item.id] = isChildActive;
        }
      });
    });

    setExpandedMenus(newExpanded);
  }, [location.pathname, config]);

  const toggleSubmenu = (id: string | number) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderIcon = (item: { label: string; icon?: React.ReactNode }) => {
    if (item.icon) {
      return item.icon;
    }
    if (!isExpanded) {
      return (
        <span className="w-5 h-5 flex items-center justify-center font-bold text-[16px] uppercase select-none shrink-0 font-mono transition-colors duration-150 leading-none">
          {item.label.charAt(0).toUpperCase()}
        </span>
      );
    }
    return undefined;
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasSubmenu = !!item.children;
    const isSubmenuOpen = !!expandedMenus[item.id];

    if (hasSubmenu && !isExpanded) {
      return (
        <div key={item.id} className="flex flex-col gap-1.5 w-full">
          {item.children.map(child => (
            <Tooltip
              content={child.label}
              disabled={tooltipsDisabled || !delayedCollapsed}
              direction="right"
              key={child.id}
            >
              <MenuBtn
                isMenuExpanded={isExpanded}
                onClick={() => {
                  navigate(child.link || "");
                  onItemClick?.();
                }}
                name={child.label}
                icon={renderIcon(child)}
                isActive={location.pathname === child.link}
              />
            </Tooltip>
          ))}
        </div>
      );
    }

    const element = hasSubmenu ? (
      <div key={item.id} className="flex flex-col gap-1 w-full">
        <Tooltip content={item.label} disabled={tooltipsDisabled || !delayedCollapsed} direction="right">
          <Button
            variant="menu"
            rounded="md"
            onClick={() => toggleSubmenu(item.id)}
            className={cn(
              "font-medium w-full menu-btn flex items-center justify-between p-2.25 h-9",
              !isExpanded && "justify-center w-auto aspect-square p-2.25 h-auto",
            )}
          >
            <span className="flex items-center gap-2">
              {renderIcon(item) && <span>{renderIcon(item)}</span>}
              {isExpanded && <span className="whitespace-nowrap">{item.label}</span>}
            </span>
            {isExpanded && (
              <span>
                {isSubmenuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            )}
          </Button>
        </Tooltip>

        {isExpanded && isSubmenuOpen && (
          <div className="pl-4 flex flex-col gap-1 mt-0.5 border-l border-chalk-20/40 ml-4.5">
            {item.children.map(child => (
              <MenuBtn
                key={child.id}
                isMenuExpanded={true}
                onClick={() => {
                  navigate(child.link);
                  onItemClick?.();
                }}
                name={child.label}
                icon={renderIcon(child)}
                isActive={location.pathname === child.link}
              />
            ))}
          </div>
        )}
      </div>
    ) : (
      <Tooltip
        content={item.label}
        disabled={tooltipsDisabled || !delayedCollapsed}
        direction="right"
        key={item.id}
      >
        <MenuBtn
          isMenuExpanded={isExpanded}
          onClick={() => {
            navigate(item.link || "");
            onItemClick?.();
          }}
          name={item.label}
          icon={renderIcon(item)}
          isActive={location.pathname === item.link}
        />
      </Tooltip>
    );

    if (isExpanded && item.divider) {
      return (
        <div key={item.id} className="w-full flex flex-col gap-1.5">
          <div className="h-[1px] bg-zinc-800/60 my-1.5 w-full shrink-0" />
          {element}
        </div>
      );
    }

    return element;
  };

  const renderSection = (section: MenuConfigElement) => {
    let sectionElement;

    if (section.type === "group") {
      sectionElement = (
        <div key={section.id} className={cn("flex flex-col gap-1 w-full first:mt-0", isExpanded && "mt-2")}>
          {isExpanded && (
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 px-2.5 py-1 select-none">
              {section.label}
            </span>
          )}
          {section.items.map(item => renderMenuItem(item))}
        </div>
      );
    } else if (section.type === "bottom") {
      sectionElement = (
        <div key={section.id} className="flex flex-col gap-1 w-full">
          {section.items.map(item => renderMenuItem(item))}
        </div>
      );
    } else {
      sectionElement = renderMenuItem(section as any);
    }

    if (isExpanded && section.divider) {
      return (
        <div key={section.id} className="w-full flex flex-col gap-1.5">
          <div className="h-[1px] bg-zinc-800/60 my-1.5 w-full shrink-0" />
          {sectionElement}
        </div>
      );
    }

    return sectionElement;
  };

  const topItems = config.filter(section => section.type !== "bottom");
  const bottomItems = config.filter(section => section.type === "bottom");

  return (
    <div className="flex flex-col justify-between flex-1 w-full h-full overflow-hidden">
      {/* Top list */}
      <div className="flex flex-col gap-1.5 w-full overflow-y-auto no-scrollbar flex-1">
        {topItems.map(section => renderSection(section))}
      </div>

      {/* Bottom list */}
      {bottomItems.length > 0 && (
        <div className="flex flex-col gap-1.5 w-full shrink-0">
          {bottomItems.map(section => renderSection(section))}
        </div>
      )}
    </div>
  );
};
