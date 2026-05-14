import { type ReactNode } from "react";
import { Flex } from "./flex";
import { Potral } from "../Portal";
interface ModalBaseProps {
  children?: ReactNode | string;
}
export const Modal = ({ children }: ModalBaseProps) => {
  return (
    <Potral>
      <div className="inset-0 fixed z-999 bg-black/30 flex flex-row justify-center items-center ">
        <Flex direction="column" className="p-20 bg-white">
          {children}
        </Flex>
      </div>
    </Potral>
  );
};
