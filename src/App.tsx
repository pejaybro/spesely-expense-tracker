import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { GlobalScrollProvider, ToastContainer } from "./components/base";
import {
  RenderRightClickMenu,
  RenderActionFeedback,
} from "./components/base/context-menu";

function App() {
  return (
    <>
      <GlobalScrollProvider>
        <RouterProvider router={router} />
        <ToastContainer />
        <RenderRightClickMenu />
        <RenderActionFeedback />
      </GlobalScrollProvider>
    </>
  );
}

export default App;
