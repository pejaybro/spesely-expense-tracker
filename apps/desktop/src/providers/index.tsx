import type { Provider as Props } from "@/root.config";
import { createContext, useContext, useState } from "react";
import { Modal } from "../components/base";
import { APP_PROVIDER_TYPE } from "../utils";

const AppContext = createContext<Props.AppContextProps | undefined>(undefined);
export const AppProvider = ({ children }: Props.ProviderProps) => {
  const [stack, setStack] = useState<
    {
      id: Props.BaseProps["id"];
      type: Props.BaseProps["type"];
      content: Props.BaseProps["content"];
    }[]
  >([]);

  const open = (
    type: Props.BaseProps["type"],
    content: Props.BaseProps["content"],
  ) => {
    const id = Math.random().toString();
    setStack(prev => [...prev, { id, type, content }]);
  };
  const close = (id: Props.BaseProps["id"]) => {
    setStack(prev => prev.filter(i => i.id !== id));
  };

  return (
    <AppContext.Provider value={{ open, close }}>
      {children}
      {stack.map(item => (
        <div key={item.id}>
          {item.type === APP_PROVIDER_TYPE.modal && <Modal>{item.content}</Modal>}
          {/* You can add PANEL here later! */}
        </div>
      ))}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProviders");
  return context;
};
