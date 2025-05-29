import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, //re fetch
      gcTime: 10 * 60 * 1000, //remove

      retry: (failureCount, error: any) => { //if auth error, don't retry
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        return failureCount < 3; //else retry 3 times
      },

      refetchOnWindowFocus: false, //don't refetch on window focus

      refetchOnReconnect: "always", //refetch on reconnect
    },
    mutations: {
      retry: 1, //retry mutations only once
    },
  },
});
