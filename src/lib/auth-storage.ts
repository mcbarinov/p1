import type { User } from "@/types"

const AUTH_TOKEN_KEY = "authToken"
const CURRENT_USER_KEY = "currentUser"

function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
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

function setCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

function clearAuthData() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(CURRENT_USER_KEY)
}

export const authStorage = {
  getAuthToken,
  setAuthToken,
  getCurrentUser,
  setCurrentUser,
  clearAuthData,
}
