import { mutationOptions, type QueryClient } from "@tanstack/react-query";
import type {
  DemoCreateData,
  DemoUpdateData,
} from "@/types/db/interface/demo.interface";
import { DemoKeys } from "./keys";
import { DemoService } from "./services";

export const DemoMutations = {
  create: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (data: DemoCreateData) => DemoService.create(data),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: DemoKeys.list() });
      },
    }),
  update: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({ id, data }: { id: number; data: DemoUpdateData }) =>
        DemoService.update(id, data),
      onSuccess: async (demo) => {
        queryClient.setQueryData(DemoKeys.detail(demo.id), demo);
        await queryClient.invalidateQueries({ queryKey: DemoKeys.list() });
      },
    }),
  deleteById: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (id: number) => DemoService.deleteById(id),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: DemoKeys.list() });
      },
    }),
};
