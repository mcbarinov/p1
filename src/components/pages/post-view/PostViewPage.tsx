import { useParams, Link } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useForum } from "@/hooks/useCache"
import { ArrowLeft } from "lucide-react"
import { PostDetail } from "./-components/PostDetail"
import { CommentForm } from "./-components/CommentForm"
import { CommentList } from "./-components/CommentList"

export default function PostViewPage() {
  const { slug, postNumber } = useParams() as { slug: string; postNumber: string }

  const forum = useForum(slug)
  const { data: post } = useSuspenseQuery(api.queries.post(slug, postNumber))

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to={`/forums/${slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {forum.title}</span>
      </Link>

      <PostDetail post={post} />

      <CommentForm slug={slug} postNumber={postNumber} />

      <CommentList slug={slug} postNumber={postNumber} />
    </div>
  )
}
