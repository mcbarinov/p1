import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { ChevronDownIcon, UserIcon, PlusCircleIcon } from "lucide-react"
import { Link, useNavigate } from "react-router"

export default function Header() {
  const { data: currentUser } = useQuery(api.queries.currentUser())
  const logoutMutation = api.mutations.useLogout()
  const navigate = useNavigate()
  return (
    <header className="py-4 border-b flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold hover:no-underline">
        DemoForums
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 font-medium border-0 bg-transparent shadow-none focus:outline-none">
          <UserIcon className="w-5 h-5" />
          {currentUser?.username}
          <ChevronDownIcon className="w-4 h-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => void navigate("/forums/new")}>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Create Forum
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              logoutMutation.mutate()
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
