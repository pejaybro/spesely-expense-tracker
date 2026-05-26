import { type ReactNode } from "react";

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