/* eslint-disable react-refresh/only-export-components */
import { api } from "@/lib/api"
import { authStorage } from "@/lib/auth-storage"
import type { User } from "@/types"
import { createContext, useCallback, useEffect, useMemo, useState } from "react"

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  console.log("[AuthContext] Provider rendered, user:", user?.username ?? "null")

  useEffect(() => {
    console.log("[AuthContext] Initial auth check")
    const authToken = authStorage.getAuthToken()
    const currentUser = authStorage.getCurrentUser()
    if (authToken && currentUser) {
      console.log("[AuthContext] Found stored user:", currentUser.username)
      setUser(currentUser)
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    console.log("[AuthContext] Login called for:", username)
    const res = await api.login({ username, password })
    authStorage.setAuthToken(res.authToken)
    authStorage.setCurrentUser(res.user)
    setUser(res.user)
  }, [])

  const logout = useCallback(async () => {
    console.log("[AuthContext] Logout called")
    await api.logout()
    authStorage.clearAuthData()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextType>(() => {
    console.log("[AuthContext] Creating new context value")
    return {
      login,
      logout,
      user,
    }
  }, [login, logout, user])

  return <AuthContext value={value}>{children}</AuthContext>
}
