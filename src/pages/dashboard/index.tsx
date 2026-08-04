import { Flex } from "@/src/components/base";

export const Dashboard = () => {
  return (
    <Flex direction="column" justify="center" items="center" className="w-full h-full flex-1 gap-2">
      <h1 className="text-5xl font-black tracking-tight">Dashboard</h1>
      <p className="text-sm text-chalk-50">Content goes here...</p>
    </Flex>
  );
};
