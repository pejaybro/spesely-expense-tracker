import { WindowTitleBar } from "@/src/components/electron";
import { Btn } from "@/src/components/base";

function App() {
  return (
    <>
      <WindowTitleBar />
      <div>this is app electron</div>
      <Btn variant="primary" rounded="md">
      click me
      </Btn>
    </>
  );
}

export default App;
