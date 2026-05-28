import { Btn, Flex, Tooltip } from "@/src/components/base";
import { Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  BarChart3,
  Repeat,
  Briefcase,
  Calculator,
  Target,
  Settings,
  Menu,
  PanelLeftOpen,
  PanelRightOpen,
  X,
} from "lucide-react";
import { ROUTES } from "../route.config";
import { MenuBtn, SidebarMenu } from "@/src/components/app";
import { cn } from "@/src/utils";
import { useState, useLayoutEffect, useEffect } from "react";
import { useContextMenu } from "@/src/components/base/context-menu";

export interface AppLayoutV2Props {
  variant?: "none" | "semi" | "full" | "hybrid";
}

// ============================================================================
// Custom Hooks
// ============================================================================

// ============================================================================
// Custom Hooks
// ============================================================================

const useAppMenu = (variant: "none" | "semi" | "full" | "hybrid") => {
  const location = useLocation();
  const [expandMenu, setExpandMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeVariant, setActiveVariant] = useState<"none" | "semi" | "full">(
    variant === "hybrid" ? "none" : variant === "full" ? "none" : variant
  );
  const [tooltipsDisabled, setTooltipsDisabled] = useState(false);

  // Sync tooltipsDisabled during expand/collapse transition
  useEffect(() => {
    setTooltipsDisabled(true);
    const timer = setTimeout(() => {
      setTooltipsDisabled(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [expandMenu]);

  // Listen for Escape key to close the menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandMenu) {
        setExpandMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandMenu]);

  // Sync isMobile and activeVariant based on screen size breakpoints
  useLayoutEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      if (variant === "hybrid") {
        if (width >= 1024) {
          setActiveVariant("none");
        } else if (width >= 768) {
          setActiveVariant("semi");
        } else {
          setActiveVariant("full");
        }
      } else if (variant === "full") {
        // Toggle between no collapse (desktop) and full collapse (mobile)
        if (width >= 768) {
          setActiveVariant("none");
        } else {
          setActiveVariant("full");
        }
      } else {
        // Preserve "none" or "semi" custom choices
        setActiveVariant(variant);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [variant]);

  // Determine expansion state based on activeVariant and expandMenu state
  const isExpanded = activeVariant === "none" ? true : expandMenu;

  const menuConfig = [
    {
      id: "dashboard",
      type: "item",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      link: ROUTES.home,
    },
    {
      id: "transactions-group",
      type: "group",
      label: "Transactions",
      items: [
        {
          id: "expenses",
          label: "Expenses",
          children: [
            { id: "daily-expense", label: "Daily", link: ROUTES.expense },
            {
              id: "trip-expense",
              label: "Trips",
              link: ROUTES.trip,
              icon: <Briefcase size={18} />,
            },
            {
              id: "recurring-expense",
              label: "Recurring",
              link: ROUTES.repeat,
              icon: <Repeat size={18} />,
            },
          ],
        },
        {
          id: "income",
          label: "Income",
          icon: <TrendingUp size={18} />,
          link: ROUTES.income,
        },
      ],
    },
    {
      id: "planning-group",
      type: "group",
      label: "Planning",
      divider: true,
      items: [
        {
          id: "budgeting",
          label: "Budgeting",
          icon: <Calculator size={18} />,
          link: ROUTES.budget,
        },
        {
          id: "goals",
          label: "Set Goals",
          icon: <Target size={18} />,
          link: ROUTES.goal,
        },
        {
          id: "analysis",
          label: "Analysis",
          icon: <BarChart3 size={18} />,
          link: ROUTES.analysis,
        },
      ],
    },
    {
      id: "settings-bottom",
      type: "bottom",
      divider: true,
      items: [
        {
          id: "settings",
          label: "Settings",
          icon: <Settings size={18} />,
          link: ROUTES.setting,
        },
      ],
    },
  ];

  // Find current active menu item ID
  const activeMenuId = (() => {
    for (const group of menuConfig) {
      if (group.type === "item" && (group as any).link === location.pathname) {
        return group.id;
      }
      if (group.type === "group" || group.type === "bottom") {
        for (const item of (group as any).items) {
          if (item.link === location.pathname) {
            return item.id;
          }
          if (item.children) {
            for (const child of item.children) {
              if (child.link === location.pathname) {
                return child.id;
              }
            }
          }
        }
      }
    }
    return "";
  })();

  return {
    activeVariant,
    isExpanded,
    expandMenu,
    setExpandMenu,
    isMobile,
    menuConfig,
    activeMenuId,
    pathname: location.pathname,
    tooltipsDisabled,
  };
};

export const AppLayoutV2 = ({ variant = "hybrid" }: AppLayoutV2Props) => {
  useContextMenu();

  const {
    activeVariant,
    isExpanded,
    expandMenu,
    setExpandMenu,
    menuConfig,
    activeMenuId,
    pathname,
    tooltipsDisabled,
  } = useAppMenu(variant);

  return (
    <Flex
      direction="row"
      className="flex-1 w-full gap-0 overflow-hidden bg-dark-c1 relative"
    >
      {/* Backdrop for "full" mode drawer */}
      {activeVariant === "full" && isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setExpandMenu(false)}
        />
      )}

      {/* SIDEBAR PANEL */}
      <SidePanel
        activeVariant={activeVariant}
        isExpanded={isExpanded}
        expandMenu={expandMenu}
        setExpandMenu={setExpandMenu}
        menuConfig={menuConfig}
        onItemClick={() => setExpandMenu(false)}
        tooltipsDisabled={tooltipsDisabled}
      />

      {/* RIGHT SIDE AREA */}
      <Flex direction="column" className="flex-1 h-full gap-0 overflow-hidden">
        {/* TOP BAR */}
        <TopBar
          activeVariant={activeVariant}
          isExpanded={isExpanded}
          setExpandMenu={setExpandMenu}
          tooltipsDisabled={tooltipsDisabled}
        />

        {/* MAIN AREA */}
        <MainArea>
          <Outlet context={{ activeMenuId, pathname }} />
        </MainArea>
      </Flex>
    </Flex>
  );
};

// ============================================================================
// Subcomponents
// ============================================================================

interface SidePanelProps {
  activeVariant: "none" | "semi" | "full";
  isExpanded: boolean;
  expandMenu: boolean;
  setExpandMenu: (expand: boolean) => void;
  menuConfig: any[];
  onItemClick: () => void;
  tooltipsDisabled: boolean;
}

const SidePanel = ({
  activeVariant,
  isExpanded,
  expandMenu,
  setExpandMenu,
  menuConfig,
  onItemClick,
  tooltipsDisabled,
}: SidePanelProps) => {
  const sidebarEl = (
    <Flex
      direction="column"
      className="bg-dark-c1 border-r border-chalk-10 overflow-hidden gap-2 shrink-0 h-full p-2 w-full"
    >
      {/* Toggle Button or Static Header */}
      {activeVariant === "none" ? (
        <div className="w-full px-2.5 py-2 shrink-0 mb-1 flex items-center gap-2 text-[14px] font-bold text-chalk-90 select-none">
          <Menu size={18} />
          <span className="whitespace-nowrap">Menu</span>
        </div>
      ) : (
        <Tooltip
          content={isExpanded ? "Collapse Menu" : "Expand Menu"}
          disabled={tooltipsDisabled}
          direction="right"
        >
          <Btn
            onClick={() => setExpandMenu(!expandMenu)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse Menu" : "Expand Menu"}
            className={cn(
              "w-full px-2 shrink-0 flex items-center gap-2",
              (activeVariant === "full" || isExpanded)
                ? "justify-start h-8 mb-1"
                : "justify-center aspect-square px-0 h-10"
            )}
          >
            {(activeVariant === "full" || isExpanded) ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelRightOpen size={18} />
            )}
            {(activeVariant === "full" || isExpanded) && (
              <span className={cn("whitespace-nowrap font-bold")}>
                Menu
              </span>
            )}
          </Btn>
        </Tooltip>
      )}

      {/* Reusable Sidebar Navigation Menu */}
      <SidebarMenu
        config={menuConfig as any}
        isExpanded={activeVariant === "full" ? true : isExpanded}
        onItemClick={onItemClick}
        tooltipsDisabled={tooltipsDisabled}
      />
    </Flex>
  );

  if (activeVariant === "full") {
    return (
      <div
        className={cn(
          "fixed top-0 left-0 h-full z-50 w-50 transform transition-transform duration-300 ease-in-out",
          isExpanded ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarEl}

        {/* Floating close X button outside the right panel edge */}
        <div
          className={cn(
            "absolute left-full top-3 ml-3 z-50 transition-opacity duration-150",
            expandMenu ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Btn
            onClick={() => setExpandMenu(false)}
            aria-label="Close Menu"
            className="w-10 h-10 flex items-center justify-center p-0 rounded-lg bg-white text-zinc-800 shadow-xl hover:bg-zinc-100 border border-zinc-200 shrink-0 cursor-pointer"
          >
            <X size={18} />
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-full transition-all duration-200 ease-in-out shrink-0",
        isExpanded ? "w-50" : "w-max md:w-50"
      )}
    >
      {sidebarEl}
    </div>
  );
};

interface TopBarProps {
  activeVariant: "none" | "semi" | "full";
  isExpanded: boolean;
  setExpandMenu: (expand: boolean) => void;
  tooltipsDisabled: boolean;
}

const TopBar = ({
  activeVariant,
  isExpanded,
  setExpandMenu,
  tooltipsDisabled,
}: TopBarProps) => {
  return (
    <Flex className="bg-dark-c1 w-full border-b border-chalk-10 px-4 text-xs h-14 items-center shrink-0">
      {activeVariant === "full" && !isExpanded && (
        <div className="shrink-0 flex items-center">
          <Tooltip
            content="Expand Menu"
            disabled={tooltipsDisabled}
            direction="right"
          >
            <Btn
              onClick={() => setExpandMenu(true)}
              aria-expanded={false}
              aria-label="Expand Menu"
              className="w-10 h-10 flex items-center justify-center shrink-0 px-0 mr-2 rounded-md hover:bg-zinc-800"
            >
              <PanelRightOpen size={18} />
            </Btn>
          </Tooltip>
        </div>
      )}
      topbar
    </Flex>
  );
};

interface MainAreaProps {
  children: React.ReactNode;
}

const MainArea = ({ children }: MainAreaProps) => {
  return (
    <Flex
      direction="column"
      className="flex-1 w-full bg-white text-black p-5 h-full overflow-y-auto relative"
    >
      {children}
    </Flex>
  );
};
