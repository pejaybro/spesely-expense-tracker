import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastContainer } from "./components/base";
import {
  RenderRightClickMenu,
  RenderActionFeedback,
} from "./components/base/context-menu";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      <RenderRightClickMenu />
      <RenderActionFeedback />
    </>
  );
}

export default App;
