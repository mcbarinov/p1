import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Navigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { authQueryOptions, useLoginMutation } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { HTTPError } from "ky"

const formSchema = z.object({
  username: z.string().min(2).max(100),
  password: z.string().min(2).max(100),
})

type LoginForm = z.infer<typeof formSchema>

export default function Login() {
  const { data: authData } = useQuery(authQueryOptions())
  const loginMutation = useLoginMutation()

  const form = useForm<LoginForm>({ resolver: zodResolver(formSchema), defaultValues: { username: "", password: "" } })

  if (authData?.user) {
    return <Navigate to="/" replace />
  }

  const onSubmit = (data: LoginForm) => {
    console.log("Submitting", data)
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>DemoForums</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="flex flex-col gap-4 w-64">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="username" autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="password" placeholder="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginMutation.isError && (
                <p className="text-sm text-red-500">
                  {loginMutation.error instanceof HTTPError && loginMutation.error.response.status === 401
                    ? "Invalid username or password"
                    : "An error occurred. Please try again"}
                </p>
              )}
              <Button type="submit" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
