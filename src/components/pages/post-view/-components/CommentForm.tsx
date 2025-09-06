import { useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { authQueryOptions, useCreateCommentMutation } from "@/lib/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface CommentFormProps {
  slug: string
  postNumber: string
}

export function CommentForm({ slug, postNumber }: CommentFormProps) {
  const [content, setContent] = useState("")
  const { data: authData } = useSuspenseQuery(authQueryOptions())
  const createComment = useCreateCommentMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    createComment.mutate(
      { slug, postNumber, content: content.trim() },
      {
        onSuccess: () => {
          setContent("")
        },
      }
    )
  }

  if (!authData?.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to comment</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add a Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            disabled={createComment.isPending}
          />
          <Button type="submit" disabled={createComment.isPending || !content.trim()}>
            {createComment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Comment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
