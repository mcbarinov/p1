/* eslint-disable react-refresh/only-export-components */
import { api } from "@/lib/api"
import { authStorage } from "@/lib/auth-storage"
import type { User } from "@/types"
import { createContext, useEffect, useMemo, useState } from "react"

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const authToken = authStorage.getAuthToken()
    const currentUser = authStorage.getCurrentUser()
    if (authToken && currentUser) {
      setUser(currentUser)
    }
  }, [])

  const login = async (username: string, password: string) => {
    const res = await api.login({ username, password })
    authStorage.setAuthToken(res.authToken)
    authStorage.setCurrentUser(res.user)
    setUser(res.user)
  }

  const logout = async () => {
    console.log("Logging out")
    await api.logout()
    authStorage.clearAuthData()
    setUser(null)
  }

  const value = useMemo<AuthContextType>(() => {
    return {
      login,
      logout,
      user,
    }
  }, [user])

  return <AuthContext value={value}>{children}</AuthContext>
}
