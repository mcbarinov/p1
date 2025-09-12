import type { LoginRequest, LoginResponse, Forum, Post, User, Comment } from "@/types"
import { http, HttpResponse } from "msw"
import { mockForums, mockPosts, mockUsers, mockComments, mockSessions } from "@/mocks/data"

// Helper function to validate session and get current user
function validateSession(request: Request): User | null {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]

  // First try to get from in-memory mockSessions
  let user = mockSessions.get(token)

  // If not found, try localStorage
  if (!user) {
    try {
      const stored = localStorage.getItem(`msw-session-${token}`)
      if (stored) {
        user = JSON.parse(stored) as User
        // Restore to in-memory map for faster access
        mockSessions.set(token, user)
      }
    } catch (error) {
      console.error("Failed to load session from localStorage:", error)
    }
  }

  return user ?? null
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

    // Store session in memory and localStorage
    mockSessions.set(sessionId, userWithoutPassword)
    try {
      localStorage.setItem(`msw-session-${sessionId}`, JSON.stringify(userWithoutPassword))
    } catch (error) {
      console.error("Failed to save session to localStorage:", error)
    }

    const response: LoginResponse = {
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

    // Invalidate session from memory and localStorage
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (token) {
      mockSessions.delete(token)
      try {
        localStorage.removeItem(`msw-session-${token}`)
      } catch (error) {
        console.error("Failed to remove session from localStorage:", error)
      }
    }

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

  // Get posts by forum slug with pagination
  http.get("/api/forums/:slug/posts", ({ params, request }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page") ?? "1")
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10")

    const forum = mockForums.find((f) => f.slug === slug)

    if (!forum) {
      return HttpResponse.json({ error: "Forum not found" }, { status: 404 })
    }

    const allForumPosts = mockPosts
      .filter((post) => post.forumId === forum.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const totalCount = allForumPosts.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedPosts = allForumPosts.slice(startIndex, endIndex)

    return HttpResponse.json({
      items: paginatedPosts,
      totalCount,
      page,
      pageSize,
      totalPages,
    })
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

    // Check if slug already exists
    const existingForum = mockForums.find((f) => f.slug === data.slug)
    if (existingForum) {
      return HttpResponse.json({ error: "A forum with this slug already exists" }, { status: 400 })
    }

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
  http.get("/api/forums/:slug/posts/:postNumber", ({ params, request }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, postNumber } = params
    const forum = mockForums.find((f) => f.slug === slug)

    if (!forum) {
      return HttpResponse.json({ error: "Forum not found" }, { status: 404 })
    }

    const post = mockPosts.find((p) => p.number === Number(postNumber) && p.forumId === forum.id)

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

    // Calculate the next post number for this forum
    const forumPosts = mockPosts.filter((p) => p.forumId === forum.id)
    const nextNumber = forumPosts.length > 0 ? Math.max(...forumPosts.map((p) => p.number)) + 1 : 1

    const newPost: Post = {
      id: crypto.randomUUID(),
      forumId: forum.id,
      number: nextNumber,
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

  // Get comments for a post
  http.get("/api/forums/:slug/posts/:postNumber/comments", ({ params, request }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, postNumber } = params
    const forum = mockForums.find((f) => f.slug === slug)

    if (!forum) {
      return HttpResponse.json({ error: "Forum not found" }, { status: 404 })
    }

    const post = mockPosts.find((p) => p.number === Number(postNumber) && p.forumId === forum.id)

    if (!post) {
      return HttpResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const postComments = mockComments
      .filter((comment) => comment.postId === post.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return HttpResponse.json(postComments)
  }),

  // Get current user
  http.get("/api/users/me", ({ request }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return HttpResponse.json(user)
  }),

  // Create new comment
  http.post("/api/forums/:slug/posts/:postNumber/comments", async ({ request, params }) => {
    const user = validateSession(request)
    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, postNumber } = params
    const forum = mockForums.find((f) => f.slug === slug)

    if (!forum) {
      return HttpResponse.json({ error: "Forum not found" }, { status: 404 })
    }

    const post = mockPosts.find((p) => p.number === Number(postNumber) && p.forumId === forum.id)

    if (!post) {
      return HttpResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const data = (await request.json()) as { content: string }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      postId: post.id,
      content: data.content,
      authorId: user.id,
      createdAt: new Date(),
      updatedAt: null,
    }

    // Add to mock comments array
    mockComments.push(newComment)

    return HttpResponse.json(newComment, { status: 201 })
  }),
]
