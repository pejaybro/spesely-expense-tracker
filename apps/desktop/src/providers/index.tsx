import type { Provider as Props } from "@/root.config";
import { createContext, useContext, useState } from "react";
import { Modal, SidePanel } from "../components/base/";
import { APP_PROVIDER_TYPE } from "../utils";

const AppContext = createContext<Props.AppContextProps | undefined>(undefined);
export const AppProvider = ({ children }: Props.ProviderProps) => {
  const [stack, setStack] = useState<
    {
      id: Props.BaseProps["id"];
      type: Props.BaseProps["type"];
      content?: Props.BaseProps["providerContent"];
      options?: Props.BaseProps["options"];
    }[]
  >([]);

  const open = (
    type: Props.BaseProps["type"],
    content?: Props.BaseProps["providerContent"],
    options?: Props.BaseProps["options"],
  ) => {
    const id = Math.random().toString();
    setStack((prev) => [...prev, { id, type, content, options }]);
  };
  const close = (id: Props.BaseProps["id"]) => {
    setStack((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <AppContext.Provider value={{ open, close }}>
      {children}
      {stack.map((item) => (
        <div key={item.id}>
          {item.type === APP_PROVIDER_TYPE.MODAL && (
            <Modal options={item.options || {}} onClose={() => close(item.id)}>
              {item.content &&
                item.content({
                  close: () => close(item.id),
                })}
            </Modal>
          )}
          {item.type === APP_PROVIDER_TYPE.SIDE_PANEL && (
            <SidePanel
              options={item.options || {}}
              onClose={() => close(item.id)}
            >
              {item.content?.({
                close: () => close(item.id),
              })}
            </SidePanel>
          )}
        </div>
      ))}
    </AppContext.Provider>
  );
};

export const useAppProvider = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProviders");
  return context;
};