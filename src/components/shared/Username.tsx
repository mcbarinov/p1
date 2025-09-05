import { useUser } from "@/hooks/useCache"

interface UsernameProps {
  id: string
  fallback?: string
  className?: string
}

export function Username({ id, fallback = "Unknown", className }: UsernameProps) {
  const user = useUser(id)
  return <span className={className}>{user?.username ?? fallback}</span>
}
