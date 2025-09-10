import { useParams, Link, useNavigate } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useForum } from "@/hooks/useCache"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Username } from "@/components/shared/Username"
import { formatDate } from "@/lib/formatters"

export default function ListPosts() {
  const { slug } = useParams() as { slug: string }
  const navigate = useNavigate()

  // Get forum from cached forums list - no API call needed
  const forum = useForum(slug)

  // Only posts need to be fetched per forum
  const { data: posts } = useSuspenseQuery(api.queries.posts(slug))

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
            <TableRow
              key={post.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => void navigate(`/forums/${slug}/${String(post.number)}`)}
            >
              <TableCell>{formatDate(post.createdAt)}</TableCell>
              <TableCell>
                <Username id={post.authorId} />
              </TableCell>
              <TableCell>{post.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
