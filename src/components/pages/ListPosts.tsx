import { useLoaderData } from "react-router"
import type { Forum, Post, User } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LoaderData {
  forum: Forum
  posts: Post[]
  users: User[]
}

export default function ListPosts() {
  const { forum, posts, users } = useLoaderData<LoaderData>()

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
