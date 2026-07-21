import { createContext, useContext, useState, type ReactNode } from "react";
import { Modal, SidePanel } from "../components/base/";
import { APP_PROVIDER_TYPE } from "../utils";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

export namespace Provider {
  export interface BaseProps {
    children: ReactNode;
    id: string;
    type: string;
    content: ReactNode;
    custom: () => ReactNode;
    providerContent: (helpers: { close: () => void }) => ReactNode;
    options?: {
      [key: string]: unknown;
      onSide?: "left" | "right" | undefined;
    };
  }
  export interface AppContextProps {
    open: (
      type: BaseProps["type"],
      content?: BaseProps["providerContent"],
      options?: BaseProps["options"],
    ) => void;
    close: (id: BaseProps["id"]) => void;
  }
  export interface ProviderProps {
    children: BaseProps["children"];
  }
}

/* ─────────────────────────────────────────────
   Component & Context
   ───────────────────────────────────────────── */

const AppContext = createContext<Provider.AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: Provider.ProviderProps) => {
  const [stack, setStack] = useState<
    {
      id: Provider.BaseProps["id"];
      type: Provider.BaseProps["type"];
      content?: Provider.BaseProps["providerContent"];
      options?: Provider.BaseProps["options"];
    }[]
  >([]);

  const open = (
    type: Provider.BaseProps["type"],
    content?: Provider.BaseProps["providerContent"],
    options?: Provider.BaseProps["options"],
  ) => {
    const id = Math.random().toString();
    setStack((prev) => [...prev, { id, type, content, options }]);
  };
  const close = (id: Provider.BaseProps["id"]) => {
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