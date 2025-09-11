import { useParams, Link, useNavigate, useSearchParams } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useForum } from "@/hooks/useCache"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Username } from "@/components/shared/Username"
import { formatDate } from "@/lib/formatters"
import { Paginator } from "./-components/Paginator"

export default function PostListPage() {
  const { slug } = useParams() as { slug: string }
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const currentPage = Number(searchParams.get("page") ?? "1")
  const pageSize = Number(searchParams.get("pageSize") ?? "10")

  // Get forum from cached forums list - no API call needed
  const forum = useForum(slug)

  // Fetch paginated posts
  const { data: paginatedData } = useSuspenseQuery(api.queries.posts(slug, currentPage, pageSize))
  const { items: posts, totalPages } = paginatedData

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
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                No posts yet. Be the first to create one!
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow
                key={post.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/forums/${slug}/${String(post.number)}`)}
              >
                <TableCell>{formatDate(post.createdAt)}</TableCell>
                <TableCell>
                  <Username id={post.authorId} />
                </TableCell>
                <TableCell>{post.title}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Paginator currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} totalCount={paginatedData.totalCount} />
    </div>
  )
}
