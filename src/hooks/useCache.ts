import { useSuspenseQuery } from "@tanstack/react-query"
import { forumsQueryOptions, usersQueryOptions } from "@/lib/queries"
import type { User, Forum } from "@/types"

/**
 * Hook to get all users from cache
 * Users are loaded once on app start and cached indefinitely
 */
export function useUsers() {
  const { data: users } = useSuspenseQuery(usersQueryOptions())
  return users
}

/**
 * Hook to get a specific user by ID from cached users list
 */
export function useUser(userId: string): User | undefined {
  const users = useUsers()
  return users.find((u) => u.id === userId)
}

/**
 * Hook to get all forums from cache
 * Forums are loaded once on app start and cached indefinitely
 */
export function useForums() {
  const { data: forums } = useSuspenseQuery(forumsQueryOptions())
  return forums
}

/**
 * Hook to get a specific forum by slug from cached forums list
 */
export function useForum(slug: string): Forum | undefined {
  const forums = useForums()
  return forums.find((f) => f.slug === slug)
}
