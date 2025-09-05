import type { Comment } from "@/types"
import { Username } from "@/components/shared/Username"
import { formatDateTime } from "@/lib/formatters"

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="border-l-2 border-muted pl-4 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Username id={comment.authorId} />
        <span>•</span>
        <span>{formatDateTime(comment.createdAt)}</span>
      </div>
      <p className="whitespace-pre-wrap">{comment.content}</p>
    </div>
  )
}
