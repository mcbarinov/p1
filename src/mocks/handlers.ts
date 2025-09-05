import type { LoginRequest, LoginResponse, Forum, Post, User } from "@/types"
import { http, HttpResponse } from "msw"
import { mockForums, mockPosts, mockSessions, mockUsers } from "./data"

// Helper function to validate session and get current user
function validateSession(request: Request): User | null {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]
  return mockSessions.get(token) ?? null
}

export const handlers = [
  // Login endpoint
  http.post("/api/auth/login", async ({ request }) => {
    const credentials = (await request.json()) as LoginRequest

    // Find user by credentials
    const user = mockUsers.find((u) => u.username === credentials.username && u.password === credentials.password)

    if (!user) {
      return HttpResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Generate session
    const sessionId = crypto.randomUUID()
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      role: user.role,
    }

    // Store session
    mockSessions.set(sessionId, userWithoutPassword)

    const response: LoginResponse = {
      user: userWithoutPassword,
      authToken: sessionId,
    }

    return HttpResponse.json(response)
  }),

  // Logout endpoint
  http.post("/api/auth/logout", ({ request }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Invalidate session
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (token) mockSessions.delete(token)

    return HttpResponse.json({ message: "Logged out successfully" })
  }),

  // Get all forums
  http.get("/api/forums", ({ request }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return HttpResponse.json(mockForums)
  }),

  // Get posts by forum slug
  http.get("/api/forums/:slug/posts", ({ params, request }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params
    const forum = mockForums.find((f) => f.slug === slug)

    if (!forum) {
      return HttpResponse.json({ error: "Forum not found" }, { status: 404 })
    }

    const forumPosts = mockPosts.filter((post) => post.forumId === forum.id)
    return HttpResponse.json(forumPosts)
  }),

  // Get all users (without passwords)
  http.get("/api/users", ({ request }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const usersWithoutPasswords = mockUsers.map(({ id, username, role }) => ({
      id,
      username,
      role,
    }))
    return HttpResponse.json(usersWithoutPasswords)
  }),

  // Create new forum
  http.post("/api/forums", async ({ request }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = (await request.json()) as Omit<Forum, "id">

    // Generate a unique ID
    const newForum: Forum = {
      id: crypto.randomUUID(),
      ...data,
    }

    // Add to mock forums array
    mockForums.push(newForum)

    return HttpResponse.json(newForum, { status: 201 })
  }),

  // Get single post
  http.get("/api/forums/:slug/posts/:postId", ({ params, request }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, postId } = params
    const forum = mockForums.find((f) => f.slug === slug)

    if (!forum) {
      return HttpResponse.json({ error: "Forum not found" }, { status: 404 })
    }

    const post = mockPosts.find((p) => p.id === postId && p.forumId === forum.id)

    if (!post) {
      return HttpResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return HttpResponse.json(post)
  }),

  // Create new post
  http.post("/api/forums/:slug/posts", async ({ request, params }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params
    const forum = mockForums.find((f) => f.slug === slug)

    if (!forum) {
      return HttpResponse.json({ error: "Forum not found" }, { status: 404 })
    }

    const data = (await request.json()) as { title: string; content: string; tags: string[] }

    const newPost: Post = {
      id: crypto.randomUUID(),
      forumId: forum.id,
      title: data.title,
      content: data.content,
      tags: data.tags,
      authorId: user.id,
      createdAt: new Date(),
      updatedAt: null,
    }

    // Add to mock posts array
    mockPosts.push(newPost)

    return HttpResponse.json(newPost, { status: 201 })
  }),
]
