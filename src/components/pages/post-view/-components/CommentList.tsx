import { useSuspenseQuery } from "@tanstack/react-query"
import { commentsQueryOptions } from "@/lib/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommentItem } from "./CommentItem"

interface CommentListProps {
  slug: string
  postNumber: string
}

export function CommentList({ slug, postNumber }: CommentListProps) {
  const { data: comments } = useSuspenseQuery(commentsQueryOptions(slug, postNumber))

  if (comments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </CardContent>
    </Card>
  )
}
