import type { User } from "@/types"

const CURRENT_USER_KEY = "currentUser"
const AUTH_TOKEN_KEY = "authToken"

export interface AuthData {
  user: User
  authToken: string
}

function getCurrentUser(): User | null {
  const userStr = localStorage.getItem(CURRENT_USER_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

function setAuthData(data: AuthData): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user))
  localStorage.setItem(AUTH_TOKEN_KEY, data.authToken)
}

function clearAuthData(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

// Legacy method for backward compatibility during migration
function getAuthData(): AuthData | null {
  const user = getCurrentUser()
  const authToken = getAuthToken()
  if (!user || !authToken) return null
  return { user, authToken }
}

export const authStorage = {
  getCurrentUser,
  getAuthToken,
  setAuthData,
  clearAuthData,
  getAuthData, // Keep for backward compatibility
}
