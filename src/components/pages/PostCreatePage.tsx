import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { AppError } from "@/lib/errors"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string(),
})

type NewPostForm = z.infer<typeof formSchema>

export default function PostCreatePage() {
  const navigate = useNavigate()
  const { slug } = useParams() as { slug: string }
  const createPostMutation = api.mutations.useCreatePost()

  const form = useForm<NewPostForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  })

  const onSubmit = (data: NewPostForm) => {
    const tags = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    createPostMutation.mutate(
      {
        ...data,
        tags,
        forumSlug: slug,
      },
      {
        onSuccess: (newPost) => {
          toast.success("Post created successfully!")
          void navigate(`/forums/${slug}/${String(newPost.number)}`)
        },
      }
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={8} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="react, typescript, web" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {createPostMutation.error && (
                <p className="text-sm text-red-500">{AppError.fromUnknown(createPostMutation.error).message}</p>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={createPostMutation.isPending}>
                  {createPostMutation.isPending ? "Creating..." : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={() => void navigate(`/forums/${slug}`)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
