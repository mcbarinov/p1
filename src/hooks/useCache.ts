import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { NotFoundError } from "@/lib/errors"
import type { User, Forum } from "@/types"

/**
 * Hook to get all users from cache
 * Users are loaded once on app start and cached indefinitely
 */
export function useUsers() {
  const { data: users } = useSuspenseQuery(api.queries.users())
  return users
}

/**
 * Hook to get a specific user by ID from cached users list
 */
export function useUser(userId: string): User {
  const users = useUsers()
  const user = users.find((u) => u.id === userId)
  if (!user) {
    throw new NotFoundError("User not found")
  }
  return user
}

/**
 * Hook to get all forums from cache
 * Forums are loaded once on app start and cached indefinitely
 */
export function useForums() {
  const { data: forums } = useSuspenseQuery(api.queries.forums())
  return forums
}

/**
 * Hook to get a specific forum by slug from cached forums list
 */
export function useForum(slug: string): Forum {
  const forums = useForums()
  const forum = forums.find((f) => f.slug === slug)
  if (!forum) {
    throw new NotFoundError("Forum not found")
  }
  return forum
}
