import { Btn, Flex } from "@/src/components/base";
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
          className="w-72 bg-dark-c1 rounded-xl border border-white/5 h-full p-4 transition-all hover:border-white/10"
        >
          {/* Top Section: Menu */}
          <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {nav.map(item => {
              const isActive = location.pathname === item.link;
              return (
                <Btn
                  key={item.id}
                  onClick={() => navigate(item.link)}
                  variant="menu"
                  
                >
                  <span
                    className={`${isActive ? "text-violet-c1" : "opacity-80"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="whitespace-nowrap">{item.name}</span>
                </Btn>
              );
            })}
          </div>

          {/* Bottom Section: Settings */}
          <div className="flex flex-col gap-1.5 pt-4 border-t border-white/5">
            <div
              onClick={() => navigate(ROUTES.setting)}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 
                text-sm font-bold capitalize tracking-widest
                ${
                  location.pathname === ROUTES.setting
                    ? "bg-violet-c1/10 text-violet-c1 border border-violet-c1/20"
                    : "opacity-60 hover:opacity-100 hover:bg-white/5 border border-transparent hover:border-white/5"
                }
              `}
            >
              <span className="opacity-80">
                <Settings size={18} />
              </span>
              <span className="whitespace-nowrap">Settings</span>
            </div>
          </div>
        </Flex>

        {/* MAIN CONTENT AREA */}
        <Flex
          direction="column"
          className="flex-1 bg-dark-c1 rounded-xl border border-white/5 p-8 h-full overflow-y-auto relative group"
        >
          <Outlet />
        </Flex>
      </Flex>

      {/* BOTTOM BAR: Status Bar */}
      <Flex
        direction="row"
        items="center"
        justify="between"
        className="h-16 bg-dark-c1 rounded-xl w-full border border-white/5 px-6 text-xs font-black uppercase tracking-widest"
      >
        <span>Status: Online</span>
      </Flex>
    </Flex>
  );
};
