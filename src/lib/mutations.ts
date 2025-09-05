import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "./api"
import type { Forum, LoginRequest } from "@/types"
import type { AuthData } from "./auth-storage"
import { authStorage } from "./auth-storage"
import { toast } from "sonner"
import { useNavigate } from "react-router"

interface CreateForumData {
  title: string
  slug: string
  description: string
  category: "Technology" | "Science" | "Art"
}

export function useCreateForum() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateForumData) => {
      return api.createForum(data)
    },
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

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await api.login(credentials)
      const authData: AuthData = {
        user: response.user,
        authToken: response.authToken,
      }
      return authData
    },
    onSuccess: (authData) => {
      authStorage.setAuthData(authData)
      queryClient.setQueryData(["currentUser"], authData)
      toast.success("Logged in successfully")
      void navigate("/")
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      await api.logout()
    },
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
