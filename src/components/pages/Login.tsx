/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import { HTTPError } from "ky"
import { useAuth } from "@/hooks/useAuth"
import { Navigate } from "react-router"

const formSchema = z.object({
  username: z.string().min(2).max(100),
  password: z.string().min(2).max(100),
})

type LoginForm = z.infer<typeof formSchema>

export default function Login() {
  const { login, user } = useAuth()

  const form = useForm<LoginForm>({ resolver: zodResolver(formSchema), defaultValues: { username: "", password: "" } })

  if (user) {
    return <Navigate to="/" replace />
  }

  const onSubmit = async (data: LoginForm) => {
    console.log("Submitting", data)
    try {
      await login(data.username, data.password)
    } catch (error) {
      const message =
        error instanceof HTTPError && error.response.status === 401
          ? "Invalid username or password"
          : "An unexpected error occurred"
      form.setError("root", { message })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>DemoForums</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-64">
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

              {form.formState.errors.root && <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>}
              <Button type="submit">Login</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
