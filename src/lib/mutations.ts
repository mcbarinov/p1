import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "./api"
import type { Forum } from "@/types"
import { toast } from "sonner"

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
