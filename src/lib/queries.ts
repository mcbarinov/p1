import { queryOptions } from "@tanstack/react-query"
import { api } from "./api"
import { authStorage } from "./auth-storage"

export const authQueryOptions = () =>
  queryOptions({
    queryKey: ["currentUser"],
    queryFn: () => authStorage.getAuthData(),
    staleTime: Infinity, // Never consider auth data stale
    gcTime: Infinity, // Never remove from memory - permanent cache
  })

export const forumsQueryOptions = () =>
  queryOptions({
    queryKey: ["forums"],
    queryFn: () => api.getForums(),
    staleTime: Infinity, // Never consider forums data stale
    gcTime: Infinity, // Never remove from memory - permanent cache
  })

export const postsQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["posts", slug],
    queryFn: () => api.getPostsByForumSlug(slug),
    staleTime: 1 * 60 * 1000, // Consider fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  })

export const usersQueryOptions = () =>
  queryOptions({
    queryKey: ["users"],
    queryFn: () => api.getUsers(),
    staleTime: Infinity, // Never consider users data stale
    gcTime: Infinity, // Never remove from memory - permanent cache
  })
