import type { LoginRequest, LoginResponse, Forum } from "@/types"
import { http, HttpResponse } from "msw"
import { mockForums, mockPosts, mockSessions, mockUsers } from "./data"

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
    const sessionId = request.headers.get("Authorization")?.split(" ")[1]
    if (!sessionId) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Invalidate session
    mockSessions.delete(sessionId)

    return HttpResponse.json({ message: "Logged out successfully" })
  }),

  // Get all forums
  http.get("/api/forums", () => {
    // const validationError = validateSession(request)
    // if (validationError) return validationError

    return HttpResponse.json(mockForums)
  }),

  // Get forum by slug
  http.get("/api/forums/:slug", ({ params }) => {
    const { slug } = params
    const forum = mockForums.find((f) => f.slug === slug)

    if (!forum) {
      return HttpResponse.json({ error: "Forum not found" }, { status: 404 })
    }

    return HttpResponse.json(forum)
  }),

  // Get posts by forum slug
  http.get("/api/forums/:slug/posts", ({ params }) => {
    const { slug } = params
    const forum = mockForums.find((f) => f.slug === slug)

    if (!forum) {
      return HttpResponse.json({ error: "Forum not found" }, { status: 404 })
    }

    const forumPosts = mockPosts.filter((post) => post.forumId === forum.id)
    return HttpResponse.json(forumPosts)
  }),

  // Get all users (without passwords)
  http.get("/api/users", () => {
    const usersWithoutPasswords = mockUsers.map(({ id, username, role }) => ({
      id,
      username,
      role,
    }))
    return HttpResponse.json(usersWithoutPasswords)
  }),

  // Create new forum
  http.post("/api/forums", async ({ request }) => {
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
]
