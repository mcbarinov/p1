import { useParams, Link } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { postQueryOptions } from "@/lib/queries"
import { useForum } from "@/hooks/useCache"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { Username } from "@/components/shared/Username"
import { formatDateTime } from "@/lib/formatters"

export default function PostViewPage() {
  const { slug, postId } = useParams() as { slug: string; postId: string }

  const forum = useForum(slug)
  const { data: post } = useSuspenseQuery(postQueryOptions(slug, postId))

  if (!forum) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8 text-red-500">Forum not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Link to={`/forums/${slug}`} className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {forum.title}</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <CardDescription className="flex items-center gap-4">
            <span>
              By <Username id={post.authorId} />
            </span>
            <span>•</span>
            <span>{formatDateTime(post.createdAt)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
          {post.tags.length > 0 && (
            <div className="flex gap-2 mt-6 pt-6 border-t">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
