import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  BarChart3,
  Repeat,
  Briefcase,
  Calculator,
  Target,
  BookOpen,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { PATH } from "./path.config";

export interface NavItem {
  id: number;
  subtitle: string;
  name: string;
  icon: LucideIcon;
  link: string;
  stat: string;
  stat2?: string;
  pillBg: string;
  pillBgBack?: string;
  hoverBorder: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 0,
    subtitle: "OVERVIEW",
    name: "Dashboard",
    icon: LayoutDashboard,
    link: PATH.home(),
    stat: "123,456",
    stat2: "Net: $12,450.00",
    pillBg: "bg-dash-4",
    pillBgBack: "bg-dash-2",
    hoverBorder: "hover:border-dash-5/60",
  },
  {
    id: 1,
    subtitle: "TRANSACTIONS",
    name: "Expense",
    icon: Receipt,
    link: PATH.expense(),
    stat: "$4,250.00",
    stat2: "Last Mo: $3,800.00",
    pillBg: "bg-exp-3",
    pillBgBack: "bg-exp-1",
    hoverBorder: "hover:border-exp-4/60",
  },
  {
    id: 2,
    subtitle: "EARNINGS",
    name: "Income",
    icon: TrendingUp,
    link: PATH.income(),
    stat: "$8,500.00",
    stat2: "Last Mo: $7,900.00",
    pillBg: "bg-inc-3",
    pillBgBack: "bg-inc-1",
    hoverBorder: "hover:border-inc-4/60",
  },
  {
    id: 3,
    subtitle: "REPORTS",
    name: "Analysis",
    icon: BarChart3,
    link: PATH.analysis(),
    stat: "Overview & Metrics",
    stat2: "+18.5% Savings",
    pillBg: "bg-analysis-3",
    pillBgBack: "bg-analysis-1",
    hoverBorder: "hover:border-analysis-4/60",
  },
  {
    id: 4,
    subtitle: "AUTOMATED",
    name: "Recurring",
    icon: Repeat,
    link: PATH.repeat(),
    stat: "12 Active",
    stat2: "Total: $850/mo",
    pillBg: "bg-repeat-3",
    pillBgBack: "bg-repeat-1",
    hoverBorder: "hover:border-repeat-4/60",
  },
  {
    id: 5,
    subtitle: "TRAVEL",
    name: "Trips",
    icon: Briefcase,
    link: PATH.trip(),
    stat: "2 Active",
    stat2: "Spent: $1,120",
    pillBg: "bg-trip-4",
    pillBgBack: "bg-trip-2",
    hoverBorder: "hover:border-trip-5/60",
  },
  {
    id: 6,
    subtitle: "PLANNING",
    name: "Budgeting",
    icon: Calculator,
    link: PATH.budget(),
    stat: "78% Used",
    stat2: "$650 Remaining",
    pillBg: "bg-budget-3",
    pillBgBack: "bg-budget-1",
    hoverBorder: "hover:border-budget-4/60",
  },
  {
    id: 7,
    subtitle: "TARGETS",
    name: "Goals",
    icon: Target,
    link: PATH.goal(),
    stat: "3/5 Reached",
    stat2: "Target: $10,000",
    pillBg: "bg-goal-3",
    pillBgBack: "bg-goal-1",
    hoverBorder: "hover:border-goal-4/60",
  },
  {
    id: 8,
    subtitle: "HELP & INFO",
    name: "Guide",
    icon: BookOpen,
    link: PATH.guide(),
    stat: "Docs & FAQ",
    stat2: "12 Topics",
    pillBg: "bg-guide-3",
    pillBgBack: "bg-guide-1",
    hoverBorder: "hover:border-guide-4/60",
  },
];

export const SETTINGS_NAV_ITEM: NavItem = {
  id: 9,
  subtitle: "PREFERENCES",
  name: "Settings",
  icon: Settings,
  link: PATH.setting(),
  stat: "System Settings",
  pillBg: "bg-guide-3",
  hoverBorder: "hover:border-guide-4/60",
};
