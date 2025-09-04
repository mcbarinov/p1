import { queryOptions } from "@tanstack/react-query"
import { api } from "./api"

export const forumsQueryOptions = () =>
  queryOptions({
    queryKey: ["forums"],
    queryFn: () => api.getForums(),
    staleTime: Infinity, // Never consider forums data stale
    gcTime: Infinity, // Never remove from memory - permanent cache
  })
