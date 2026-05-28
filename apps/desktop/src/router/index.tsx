import { createHashRouter, Navigate } from "react-router-dom";
import { WindowLayout } from "./layout/WindowLayout";
import { AppLayoutV2 } from "./layout/AppLayoutV2";
import { Dashboard } from "../pages/dashboard";
import { Settings } from "../pages/settings";
import { DailyExpense } from "../pages/daily-expense";
import { Income } from "../pages/income";
import { Goals } from "../pages/goals";
import { Budget } from "../pages/budget";
import { Trips } from "../pages/trips";
import { RecurringExpense } from "../pages/recurring-expense";
import { Analytics } from "../pages/analytics";
import { Auth } from "../pages/auth";
import { ROUTES } from "./route.config";

/**
 * Modern Data Router Configuration for Electron
 */
export const router = createHashRouter([
  {
    path: "/",
    element: (
      <WindowLayout>
        <AppLayoutV2 variant="hybrid" />
      </WindowLayout>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.home} replace /> },
      { path: ROUTES.home, element: <Dashboard /> },
      { path: ROUTES.expense, element: <DailyExpense /> },
      { path: ROUTES.income, element: <Income /> },
      { path: ROUTES.analysis, element: <Analytics /> },
      { path: ROUTES.repeat, element: <RecurringExpense /> },
      { path: ROUTES.trip, element: <Trips /> },
      { path: ROUTES.budget, element: <Budget /> },
      { path: ROUTES.goal, element: <Goals /> },
      { path: ROUTES.setting, element: <Settings /> },
      { path: ROUTES.login, element: <Auth /> },
      { path: "*", element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
]);
