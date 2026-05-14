import { createContext, useContext, useState, type ReactNode } from "react";
import { type Provider } from "@/root.config";
import { Modal } from "../components/base";

const ModalContext = createContext<Provider.ModalContextProps | undefined>(
  undefined,
);

export const ModalProvider = ({ children }: Provider.ProviderProps) => {
  const [modal, setModal] = useState<{ isOpen: Boolean; content: ReactNode }>({
    isOpen: false,
    content: null,
  });

  const openModal = (content: ReactNode) => {
    setModal({
      isOpen: true,
      content,
    });
  };
  const closeModal = () =>
    setModal({
      isOpen: false,
      content: null,
    });

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modal.isOpen && <Modal>{modal.content}</Modal>}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
