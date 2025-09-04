// Domain Models
export type Category = "Technology" | "Science" | "Art"

export interface Forum {
  id: string // UUID
  slug: string
  title: string
  description: string
  category: Category
}

export interface Post {
  id: string // UUID
  forumId: string // UUID
  title: string
  content: string
  tags: string[]
  authorId: string
  createdAt: Date
  updatedAt: Date | null
}

export interface Comment {
  id: string // UUID
  postId: string // UUID
  content: string
  authorId: string
  createdAt: Date
  updatedAt: Date | null
}

export type Role = "admin" | "user"

export interface User {
  id: string // UUID
  username: string
  role: Role
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  authToken: string
  user: User
}
