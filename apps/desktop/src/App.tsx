import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastContainer } from "./components/base";
import { NotifyContainer } from "./components/base/notify";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      <NotifyContainer />
    </>
  );
}

export default App;
