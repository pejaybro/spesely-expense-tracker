import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastContainer } from "./components/base";
import { NotifyContainer } from "./components/base/notify";
import {
  RenderRightClickMenu,
  RenderActionFeedback,
} from "./components/base/context-menu";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer animation-type="fade" />
      <NotifyContainer />
      <RenderRightClickMenu />
      <RenderActionFeedback />
    </>
  );
}

export default App;
