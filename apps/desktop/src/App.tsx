import { WindowTitleBar } from "@/src/components/electron";
import { BtnStyles } from "./components/base/button/btn-styles";

function App() {
  return (
    <>
      <WindowTitleBar />
      <div>this is app electron</div>
      <BtnStyles />
    </>
  );
}

export default App;
