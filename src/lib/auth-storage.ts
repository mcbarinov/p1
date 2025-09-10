import type { User } from "@/types"

const CURRENT_USER_KEY = "currentUser"
const AUTH_TOKEN_KEY = "authToken"

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

function setAuthData(user: User, authToken: string): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  localStorage.setItem(AUTH_TOKEN_KEY, authToken)
}

function clearAuthData(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const authStorage = {
  getCurrentUser,
  getAuthToken,
  setAuthData,
  clearAuthData,
}
