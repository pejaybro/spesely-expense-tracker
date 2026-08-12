import type { QueryClientConfig } from "@tanstack/react-query";

export const QUERY_CLIENT_CONFIG = {
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
    },
    mutations: {
      retry: 0,
    },
  },
} satisfies QueryClientConfig;
