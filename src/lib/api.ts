import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import ky from "ky"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import type { Forum, Post, User, LoginRequest, LoginResponse, CreateForumData, Comment } from "@/types"
import { authStorage } from "./auth-storage"

const httpClient = ky.create({
  prefixUrl: "/",
  hooks: {
    beforeRequest: [
      (request) => {
        const authToken = authStorage.getAuthToken()
        if (authToken) {
          request.headers.set("Authorization", `Bearer ${authToken}`)
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401) {
          const isLoginPage = window.location.pathname === "/login"

          if (!isLoginPage) {
            authStorage.clearAuthData()
            window.location.href = "/login"
          }
        }
        return response
      },
    ],
  },
})

export const api = {
  queries: {
    currentUser: () =>
      queryOptions({
        queryKey: ["currentUser"],
        queryFn: () => authStorage.getCurrentUser(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),

    forums: () =>
      queryOptions({
        queryKey: ["forums"],
        queryFn: () => httpClient.get("api/forums").json<Forum[]>(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),

    posts: (slug: string) =>
      queryOptions({
        queryKey: ["posts", slug],
        queryFn: () => httpClient.get(`api/forums/${slug}/posts`).json<Post[]>(),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
      }),

    post: (slug: string, postNumber: string) =>
      queryOptions({
        queryKey: ["post", slug, postNumber],
        queryFn: () => httpClient.get(`api/forums/${slug}/posts/${postNumber}`).json<Post>(),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
      }),

    users: () =>
      queryOptions({
        queryKey: ["users"],
        queryFn: () => httpClient.get("api/users").json<User[]>(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),

    comments: (slug: string, postNumber: string) =>
      queryOptions({
        queryKey: ["comments", slug, postNumber],
        queryFn: () => httpClient.get(`api/forums/${slug}/posts/${postNumber}/comments`).json<Comment[]>(),
        staleTime: 30 * 1000,
        gcTime: 2 * 60 * 1000,
      }),
  },

  mutations: {
    useLogin: () => {
      const queryClient = useQueryClient()
      const navigate = useNavigate()

      return useMutation({
        mutationFn: (credentials: LoginRequest) => httpClient.post("api/auth/login", { json: credentials }).json<LoginResponse>(),
        onSuccess: (response) => {
          authStorage.setAuthData(response.user, response.authToken)
          queryClient.setQueryData(["currentUser"], response.user)
          toast.success("Logged in successfully")
          void navigate("/")
        },
      })
    },

    useLogout: () => {
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
    },

    useCreateForum: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (data: CreateForumData) => httpClient.post("api/forums", { json: data }).json<Forum>(),
        onSuccess: (newForum: Forum) => {
          void queryClient.invalidateQueries({ queryKey: ["forums"] })
          toast.success(`Forum "${newForum.title}" created successfully!`)
        },
        onError: (error) => {
          console.error("Failed to create forum:", error)
          const message = error instanceof Error ? error.message : "Failed to create forum. Please try again."
          toast.error(message)
        },
      })
    },

    useCreatePost: () => {
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
    },

    useCreateComment: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: ({ slug, postNumber, content }: { slug: string; postNumber: string; content: string }) =>
          httpClient.post(`api/forums/${slug}/posts/${postNumber}/comments`, { json: { content } }).json<Comment>(),
        onSuccess: (_newComment, variables) => {
          void queryClient.invalidateQueries({ queryKey: ["comments", variables.slug, variables.postNumber] })
          toast.success("Comment added successfully!")
        },
        onError: (error) => {
          console.error("Failed to create comment:", error)
          toast.error("Failed to add comment. Please try again.")
        },
      })
    },
  },
}
