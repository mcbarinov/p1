import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { forumQueryOptions, postsQueryOptions, usersQueryOptions } from "@/lib/queries"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ListPosts() {
  const { slug } = useParams<{ slug: string }>()
  const { data: forum, isLoading: forumLoading, error: forumError } = useQuery(forumQueryOptions(slug!))
  const { data: posts = [], isLoading: postsLoading, error: postsError } = useQuery(postsQueryOptions(slug!))
  const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery(usersQueryOptions())

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user?.username ?? "Unknown"
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isLoading = forumLoading || postsLoading || usersLoading
  const error = forumError ?? postsError ?? usersError

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  if (error || !forum) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8 text-red-500">Error loading forum data</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{forum.title}</h1>
        <p className="text-muted-foreground">{forum.description}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Date</TableHead>
            <TableHead className="w-40">Author</TableHead>
            <TableHead>Title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{formatDate(post.createdAt)}</TableCell>
              <TableCell>{getUserName(post.authorId)}</TableCell>
              <TableCell>{post.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
