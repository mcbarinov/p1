import { useUser } from "@/hooks/useCache"

interface UsernameProps {
  id: string
  className?: string
}

export function Username({ id, className }: UsernameProps) {
  const user = useUser(id)
  return <span className={className}>{user.username}</span>
}
