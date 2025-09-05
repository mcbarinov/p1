import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Forum, Post, User, LoginRequest, LoginResponse, CreateForumData } from "@/types"
import type { AuthData } from "./auth-storage"
import { httpClient } from "./http-client"
import { authStorage } from "./auth-storage"
import { toast } from "sonner"
import { useNavigate } from "react-router"

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
    queryFn: () => httpClient.get("api/forums").json<Forum[]>(),
    staleTime: Infinity, // Never consider forums data stale
    gcTime: Infinity, // Never remove from memory - permanent cache
  })

export const postsQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["posts", slug],
    queryFn: () => httpClient.get(`api/forums/${slug}/posts`).json<Post[]>(),
    staleTime: 1 * 60 * 1000, // Consider fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  })

export const usersQueryOptions = () =>
  queryOptions({
    queryKey: ["users"],
    queryFn: () => httpClient.get("api/users").json<User[]>(),
    staleTime: Infinity, // Never consider users data stale
    gcTime: Infinity, // Never remove from memory - permanent cache
  })

export function useCreateForumMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateForumData) => httpClient.post("api/forums", { json: data }).json<Forum>(),
    onSuccess: (newForum: Forum) => {
      void queryClient.invalidateQueries({ queryKey: ["forums"] })
      toast.success(`Forum "${newForum.title}" created successfully!`)
    },
    onError: (error) => {
      console.error("Failed to create forum:", error)
      toast.error("Failed to create forum. Please try again.")
    },
  })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => httpClient.post("api/auth/login", { json: credentials }).json<LoginResponse>(),
    onSuccess: (response) => {
      const authData: AuthData = {
        user: response.user,
        authToken: response.authToken,
      }
      authStorage.setAuthData(authData)
      queryClient.setQueryData(["currentUser"], authData)
      toast.success("Logged in successfully")
      void navigate("/")
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => httpClient.post("api/auth/logout"),
    onSuccess: () => {
      authStorage.clearAuthData()
      queryClient.setQueryData(["currentUser"], null)
      queryClient.clear()
      void navigate("/login")
    },
    onError: (error) => {
      console.error("Logout failed:", error)
      toast.error("Failed to logout. Please try again.")
    },
  })
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ forumSlug, ...data }: { title: string; content: string; tags: string[]; forumSlug: string }) =>
      httpClient.post(`api/forums/${forumSlug}/posts`, { json: data }).json<Post>(),
    onSuccess: (_newPost, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["posts", variables.forumSlug] })
      toast.success("Post created successfully!")
    },
    onError: (error) => {
      console.error("Failed to create post:", error)
      toast.error("Failed to create post. Please try again.")
    },
  })
}
