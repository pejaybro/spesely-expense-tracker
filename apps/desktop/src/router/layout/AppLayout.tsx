import { Btn, Flex, Tooltip } from "@/src/components/base";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { ROUTES } from "../route.config";
import { MenuBtn } from "@/src/components/app";
import { cn } from "@/src/utils";
import { useState, useLayoutEffect } from "react";
import { useContextMenu } from "@/src/components/base/context-menu";

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useContextMenu();

  const [expandMenu, setExpandMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Sync isMobile and reset expandMenu on desktop
  useLayoutEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setExpandMenu(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // SINGLE SOURCE OF TRUTH:
  // It's expanded if it's desktop OR if it's mobile + manually toggled
  const isExpanded = !isMobile || expandMenu;

  const nav = [
    {
      id: 0,
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      link: ROUTES.home,
    },
    {
      id: 1,
      name: "Expense",
      icon: <Receipt size={18} />,
      link: ROUTES.expense,
    },
    {
      id: 2,
      name: "Income",
      icon: <TrendingUp size={18} />,
      link: ROUTES.income,
    },
    {
      id: 3,
      name: "Analysis",
      icon: <BarChart3 size={18} />,
      link: ROUTES.analysis,
    },
    {
      id: 4,
      name: "Recurring Expense",
      icon: <Repeat size={18} />,
      link: ROUTES.repeat,
    },
    {
      id: 5,
      name: "Trip Expense",
      icon: <Briefcase size={18} />,
      link: ROUTES.trip,
    },
    {
      id: 6,
      name: "Budgeting",
      icon: <Calculator size={18} />,
      link: ROUTES.budget,
    },
    { id: 7, name: "Set Goals", icon: <Target size={18} />, link: ROUTES.goal },
  ];

  return (
    <Flex
      direction="column"
      className="flex-1 w-full p-2.5 gap-2 overflow-hidden"
    >
      <Flex direction="row" className="flex-1 w-full gap-2 overflow-hidden">
        {/* SIDEBAR - Uses single variable for width */}
        <Flex
          direction="column"
          justify="between"
          className={cn(
            "bg-dark-c1 rounded-lg border border-chalk-10 h-full p-2 overflow-hidden",
            isExpanded ? "w-50" : "w-max md:w-50",
          )}
        >
          <Flex direction="column" className="gap-1.5 w-full overflow-y-auto">
            {/* Toggle Button */}
            <Tooltip
              content="Expand Menu"
              disabled={isExpanded}
              direction="right"
            >
              <Btn
                onClick={() => setExpandMenu(!expandMenu)}
                // Disabled on desktop to keep it open
                className={cn(
                  "w-full px-2",
                  !isMobile && "pointer-events-none cursor-default",
                )}
              >
                {!isMobile ? (
                  <Menu size={18} />
                ) : expandMenu ? (
                  <PanelRightOpen size={18} />
                ) : (
                  <PanelLeftOpen size={18} />
                )}
                {isExpanded && (
                  <span className={cn("whitespace-nowrap font-bold")}>
                    Spesely Menu
                  </span>
                )}
              </Btn>
            </Tooltip>

            {/* Nav Items */}
            {nav.map(item => (
              <Tooltip 
                content={item.name} 
                disabled={isExpanded} 
                direction="right"
                key={item.id}
              >
                <MenuBtn
                  isMenuExpanded={isExpanded}
                  onClick={() => navigate(item.link)}
                  name={item.name}
                  icon={item.icon}
                  isActive={location.pathname === item.link}
                />
              </Tooltip>
            ))}
          </Flex>

          {/* Settings */}
          <Flex
            direction="column"
            className="w-full pt-4 mt-4 border-t border-chalk-20"
          >
            <MenuBtn
              isMenuExpanded={isExpanded}
              onClick={() => navigate(ROUTES.setting)}
              name={"Settings"}
              icon={<Settings size={18} />}
              isActive={location.pathname === ROUTES.setting}
            />
          </Flex>
        </Flex>

        {/* MAIN CONTENT AREA */}
        <Flex
          direction="column"
          className="flex-1 bg-dark-c1 rounded-lg border border-chalk-10 p-4 h-full overflow-y-auto relative"
        >
          <Outlet />
        </Flex>
      </Flex>

      <Flex className="bg-dark-c1 rounded-lg w-full border border-chalk-10 p-4 text-xs"></Flex>
    </Flex>
  );
};
