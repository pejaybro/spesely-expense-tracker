import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { DemoKeys } from "./keys";
import { DemoMappers } from "./mappers";
import { DemoService } from "./services";

export const DemoQueries = {
  list: () =>
    queryOptions({
      queryKey: DemoKeys.list(),
      queryFn: DemoService.getAll,
      select: DemoMappers.list,
      placeholderData: keepPreviousData,
    }),
  detail: (id?: number | null) =>
    queryOptions({
      queryKey: DemoKeys.detail(id ?? 0),
      queryFn: () => DemoService.getById(id!),
      select: (demo) => (demo ? DemoMappers.item(demo) : null),
      enabled: !!id,
    }),
};
