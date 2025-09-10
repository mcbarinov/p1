import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  content: z.string().min(1, "Comment is required").max(5000, "Comment is too long"),
})

type CommentFormData = z.infer<typeof formSchema>

interface CommentFormProps {
  slug: string
  postNumber: string
}

export function CommentForm({ slug, postNumber }: CommentFormProps) {
  const createCommentMutation = api.mutations.useCreateComment()

  const form = useForm<CommentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  const onSubmit = async (data: CommentFormData) => {
    try {
      await createCommentMutation.mutateAsync({
        slug,
        postNumber,
        content: data.content.trim(),
      })
      form.reset()
    } catch {
      form.setError("root", { message: "Failed to post comment. Please try again." })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add a Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your thoughts..."
                      rows={3}
                      disabled={createCommentMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>}
            <Button type="submit" disabled={createCommentMutation.isPending || !form.watch("content").trim()}>
              {createCommentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Comment
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
