import { Flex } from "../layout";
import { Btn } from "./btn";

export const BtnStyles = () => {
  return (
    <Flex direction="column" className="p-5  gap-2.5">
      <h1>solid Btn Styles</h1>
      <Flex direction="row">
        <Btn variant="solid" className="text-para-sm">
          solid
        </Btn>
        <Btn variant="soft" className="text-para-sm text-violet-a1 ">
          soft
        </Btn>
        <Btn variant="solid" className="text-para-sm" rounded="md">
          solid
        </Btn>
        <Btn variant="solid" className="text-para-sm" rounded="full">
          solid
        </Btn>
      </Flex>
      <h1>Outline Btn Styles</h1>
      <Flex direction="row">
        <Btn variant="outline">Outline</Btn>
        <Btn variant="outline" rounded="md">
          Outline
        </Btn>
        <Btn variant="outline" rounded="full">
          Outline
        </Btn>
      </Flex>
      <h1>Icon Btn Styles</h1>
      <Flex direction="row" items="center">
        <Btn variant="solid-icon" rounded="full">
          $
        </Btn>
        <Btn variant="outline-icon" rounded="full">
          $
        </Btn>

        <Btn variant="solid-icon">$</Btn>
        <Btn variant="outline-icon">$</Btn>
        <Btn variant="solid-icon" rounded="md">
          $
        </Btn>
        <Btn variant="outline-icon" rounded="md">
          $
        </Btn>

        <Btn variant="soft-icon" className="text-para-sm text-violet-a1 " rounded="full">
          $
        </Btn>
      </Flex>
    </Flex>
  );
};
