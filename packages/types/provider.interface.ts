import { type ReactNode } from "react";

export namespace Provider {
  export interface BaseProps {
    children: ReactNode;
    id: string;
    type: string;
    content: ReactNode;
  }
  export interface AppContextProps {
    open: (type: BaseProps["type"], content: BaseProps["content"]) => void;
    close: (id: BaseProps["id"]) => void;
  }
  export interface ModalContextProps {
    openModal: (context: BaseProps["content"]) => void;
    closeModal: () => void;
  }
  export interface ProviderProps {
    children: BaseProps["children"];
  }
}
