import { createHashRouter, Navigate, type RouteObject } from "react-router-dom";
import { PATH } from "./path.config";
import { WindowLayout } from "./layouts/window.layout";
import { AppLayout } from "./layouts/app.layout";
import { ErrorLayout } from "./layouts/error.layout";

// Direct component imports (No lazy loading for instant Electron rendering)
import { Dashboard } from "../pages/dashboard";
import { Guide } from "../pages/guide";
import { DailyExpense } from "../pages/daily-expense";
import { Income } from "../pages/income";
import { Analytics } from "../pages/analytics";
import { RecurringExpense } from "../pages/recurring-expense";
import { Trips } from "../pages/trips";
import { Budget } from "../pages/budget";
import { Goals } from "../pages/goals";
import { Settings } from "../pages/settings";
import { Auth } from "../pages/auth";

/**
 * Modern Electron Route Configuration
 * Adapted from pejay-ui react-router scaffold pattern:
 * - Pure TypeScript architecture (.ts / .tsx)
 * - Component property syntax (Component: PageComponent)
 * - Hash routing for Electron file:// protocol compatibility
 * - Route-level ErrorBoundary isolation
 */
const AppRoutes: RouteObject[] = [
  {
    path: PATH.root(),
    Component: () => (
      <WindowLayout>
        <AppLayout />
      </WindowLayout>
    ),
    ErrorBoundary: ErrorLayout,
    children: [
      {
        index: true,
        Component: () => <Navigate to={PATH.home()} replace />,
      },
      {
        path: PATH.home(),
        Component: Dashboard,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.guide(),
        Component: Guide,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.expense(),
        Component: DailyExpense,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.income(),
        Component: Income,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.analysis(),
        Component: Analytics,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.repeat(),
        Component: RecurringExpense,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.trip(),
        Component: Trips,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.budget(),
        Component: Budget,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.goal(),
        Component: Goals,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.setting(),
        Component: Settings,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.login(),
        Component: Auth,
        ErrorBoundary: ErrorLayout,
      },
      {
        path: PATH.catch_all(),
        Component: () => <Navigate to={PATH.home()} replace />,
      },
    ],
  },
];

export const router = createHashRouter(AppRoutes);
