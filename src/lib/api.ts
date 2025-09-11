import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import ky from "ky"
import { AppError } from "./errors"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import type { Forum, Post, User, LoginRequest, LoginResponse, CreateForumData, Comment, PaginatedResponse } from "@/types"
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
      async (_request, _options, response) => {
        // Handle 401 redirect early
        if (response.status === 401) {
          const isLoginPage = window.location.pathname === "/login"
          if (!isLoginPage) {
            authStorage.clearAuthData()
            window.location.href = "/login"
          }
        }

        if (!response.ok) {
          // Shape non-OK responses into AppError with best-effort message extraction
          const code = AppError.codeFromStatus(response.status)
          let message = `HTTP ${String(response.status)} ${response.statusText}`
          try {
            const contentType = response.headers.get("content-type")
            if (contentType?.includes("application/json")) {
              const data = (await response.clone().json()) as Record<string, unknown>
              if (typeof data.error === "string" && data.error.trim() !== "") {
                message = data.error
              }
            }
          } catch {
            // Ignore parsing errors and use fallback message
          }
          throw new AppError(code, message)
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

    posts: (slug: string, page = 1, pageSize = 10) =>
      queryOptions({
        queryKey: ["posts", slug, page, pageSize],
        queryFn: () =>
          httpClient
            .get(`api/forums/${slug}/posts`, {
              searchParams: { page, pageSize },
            })
            .json<PaginatedResponse<Post>>(),
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
        onError: (error) => {
          const app = AppError.fromUnknown(error)
          toast.error(app.message)
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
          const app = AppError.fromUnknown(error)
          toast.error(app.message)
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
          const app = AppError.fromUnknown(error)
          toast.error(app.message)
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
          const app = AppError.fromUnknown(error)
          toast.error(app.message)
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
          const app = AppError.fromUnknown(error)
          toast.error(app.message)
        },
      })
    },
  },
}
