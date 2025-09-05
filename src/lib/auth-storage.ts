import type { User } from "@/types"

const CURRENT_USER_KEY = "currentUser"

export interface AuthData {
  user: User
  authToken: string
}

function getAuthData(): AuthData | null {
  const dataStr = localStorage.getItem(CURRENT_USER_KEY)
  if (!dataStr) return null
  try {
    return JSON.parse(dataStr) as AuthData
  } catch {
    return null
  }
}

function setAuthData(data: AuthData): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data))
}

function clearAuthData(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

function getAuthToken(): string | null {
  const data = getAuthData()
  return data?.authToken ?? null
}

export const authStorage = {
  getAuthData,
  setAuthData,
  clearAuthData,
  getAuthToken,
}
