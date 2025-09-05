import type { Forum, Post, User, LoginRequest, LoginResponse } from "@/types"
import { httpClient } from "./http-client"

export const api = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return await httpClient.post("api/auth/login", { json: credentials }).json<LoginResponse>()
  },

  async logout(): Promise<void> {
    await httpClient.post("api/auth/logout")
  },

  async getForums(): Promise<Forum[]> {
    console.log("Fetching forums...")
    return httpClient.get("api/forums").json<Forum[]>()
  },

  async getForumBySlug(slug: string): Promise<Forum> {
    return httpClient.get(`api/forums/${slug}`).json<Forum>()
  },

  async getPostsByForumSlug(slug: string): Promise<Post[]> {
    return httpClient.get(`api/forums/${slug}/posts`).json<Post[]>()
  },

  async getUsers(): Promise<User[]> {
    return httpClient.get("api/users").json<User[]>()
  },

  async createForum(data: Omit<Forum, "id">): Promise<Forum> {
    return httpClient.post("api/forums", { json: data }).json<Forum>()
  },
}
