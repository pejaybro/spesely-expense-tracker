import { Backdrop } from "./backdrop";
import { type Provider as Props } from "@/root.config";
import { Portal } from "./portal";

interface ModalBaseProps {
  children?: Props.BaseProps["children"];
  onClose?: () => void;
  options: Props.BaseProps["options"];
}

export const Modal = ({ children, onClose, options }: ModalBaseProps) => {
  return (
    <Portal>
      <Backdrop {...options} onClose={onClose}>
        <div className="relative z-10000">{children}</div>
      </Backdrop>
    </Portal>
  );
};