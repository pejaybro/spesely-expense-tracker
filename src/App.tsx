import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { GlobalScrollProvider, ToastContainer } from "./components/base";
import {
  RenderRightClickMenu,
  RenderActionFeedback,
} from "./components/base/context-menu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QUERY_CLIENT_CONFIG } from "./tanstack-query/query-config";

const queryClient = new QueryClient(QUERY_CLIENT_CONFIG);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalScrollProvider>
        <RouterProvider router={router} />
        <ToastContainer />
        <RenderRightClickMenu />
        <RenderActionFeedback />
      </GlobalScrollProvider>
    </QueryClientProvider>
  );
}

export default App;
