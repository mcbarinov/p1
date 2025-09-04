import { AuthContext } from "@/contexts/AuthContext"
import { use } from "react"

export function useAuth() {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}
