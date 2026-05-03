import { Flex } from "@/src/components/base";
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
} from "lucide-react";
import { ROUTES } from "../route.config";
import { MenuBtn } from "@/src/components/app";
import { cn } from "@/src/utils";

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    {
      id: 7,
      name: "Set Goals",
      icon: <Target size={18} />,
      link: ROUTES.goal,
    },
  ];

  return (
    <Flex
      direction="column"
      className="flex-1 w-full p-2.5 gap-2 overflow-hidden"
    >
      {/* TOP SECTION: Sidebar + Main Content */}
      <Flex direction="row" className="flex-1 w-full gap-2 overflow-hidden">
        {/* SIDEBAR */}
        <Flex
          direction="column"
          justify="between"
          className={cn(
            "w-max bg-dark-c1 rounded-lg border border-chalk-10 h-full p-2.5",
            "md:w-60 md:p-4",
          )}
        >
          {/* Top Section: Menu */}
          <Flex direction="column" className="gap-1.5 w-full overflow-y-auto ">
            {nav.map(item => {
              const isActive = location.pathname === item.link;
              return (
                <MenuBtn
                  key={item.id}
                  onClick={() => navigate(item.link)}
                  name={item.name}
                  icon={item.icon}
                  isActive={isActive}
                />
              );
            })}
          </Flex>

          {/* Bottom Section: Settings */}
          <Flex
            direction="column"
            className=" w-full ap-1.5 pt-4 mt-4 border-t border-chalk-20"
          >
            <MenuBtn
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
          className="flex-1 bg-dark-c1 rounded-lg border border-chalk-10 p-4 h-full overflow-y-auto relative group"
        >
          <Outlet />
        </Flex>
      </Flex>

      {/* BOTTOM BAR: Status Bar */}
      <Flex
        direction="row"
        items="center"
        justify="between"
        className=" bg-dark-c1 rounded-lg w-full border border-chalk-10 p-4 text-xs"
      >
       
      </Flex>
    </Flex>
  );
};
