import { WindowTitleBar } from "@/src/components/electron";
import { BtnStyles } from "./components/base/button/btn-styles";
import { HashRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <WindowTitleBar />
      <div className="p-4">
        <div>this is app electron</div>
        <BtnStyles />
      </div>
    </Router>
  );
}

export default App;
