import { useParams, Link, useNavigate, useSearchParams } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useForum } from "@/hooks/useCache"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Username } from "@/components/shared/Username"
import { formatDate } from "@/lib/formatters"
import { Paginator } from "./-components/Paginator"

export default function ListPosts() {
  const { slug } = useParams() as { slug: string }
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = Number(searchParams.get("page") ?? "1")
  const pageSize = Number(searchParams.get("pageSize") ?? "10")

  // Get forum from cached forums list - no API call needed
  const forum = useForum(slug)

  // Fetch paginated posts
  const { data: paginatedData } = useSuspenseQuery(api.queries.posts(slug, currentPage, pageSize))
  const { items: posts, totalPages } = paginatedData

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), pageSize: String(pageSize) })
  }

  const handlePageSizeChange = (newPageSize: string) => {
    setSearchParams({ page: "1", pageSize: newPageSize })
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

      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={paginatedData.totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
