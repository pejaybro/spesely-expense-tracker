import { Flex } from "./layout";

interface EmptyDataProps {
  icon?: React.ReactNode;
  label: string | React.ReactNode;
  description?: string | React.ReactNode;
}

export const EmptyData = ({ icon, label, description }: EmptyDataProps) => {
  return (
    <>
      <Flex
        direction="column"
        items="center"
        justify="center"
        className="gap-2 py-16 px-4 border border-dashed border-white/10 rounded-xl w-full"
      >
        {icon && icon}
        {typeof label === "string" ? (
          <p className="text-sm text-white/25">{label}</p>
        ) : (
          label
        )}
        {typeof description === "string" ? (
          <p className="text-xs text-white/25">{description}</p>
        ) : (
          description
        )}
      </Flex>
    </>
  );
};
