import { useParams, Link } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { postsQueryOptions } from "@/lib/queries"
import { useForum, useUsers } from "@/hooks/useCache"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function ListPosts() {
  const { slug } = useParams() as { slug: string }

  // Get forum from cached forums list - no API call needed
  const forum = useForum(slug)

  // Get all users from cache - loaded once at app start
  const users = useUsers()

  // Only posts need to be fetched per forum
  const { data: posts } = useSuspenseQuery(postsQueryOptions(slug))

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

  if (!forum) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8 text-red-500">Forum not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{forum.title}</h1>
          <p className="text-muted-foreground">{forum.description}</p>
        </div>
        <Link to={`/forums/${slug}/new`}>
          <Button>New Post</Button>
        </Link>
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
