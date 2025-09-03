import type { LoginRequest, LoginRespose } from "@/types"
import { http, HttpResponse } from "msw"
import { mockForums, mockSessions, mockUsers } from "./data"

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

    const response: LoginRespose = {
      user: userWithoutPassword,
      authToken: sessionId,
    }

    return HttpResponse.json(response)
  }),

  // Get all forums
  http.get("/api/forums", ({ request }) => {
    // const validationError = validateSession(request)
    // if (validationError) return validationError

    return HttpResponse.json(mockForums)
  }),
]
