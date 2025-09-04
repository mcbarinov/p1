import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { ChevronDownIcon, UserIcon } from "lucide-react"
import { Link } from "react-router"

export default function Header() {
  const { logout, user } = useAuth()
  return (
    <header className="py-4 border-b flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold hover:no-underline">
        DemoForums
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 font-medium border-0 bg-transparent shadow-none focus:outline-none">
          <UserIcon className="w-5 h-5" />
          {user?.username}
          <ChevronDownIcon className="w-4 h-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => void logout()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
