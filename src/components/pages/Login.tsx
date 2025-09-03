/* eslint-disable @typescript-eslint/no-misused-promises */
import { api } from "@/lib/api"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  username: z.string().min(2).max(100),
  password: z.string().min(2).max(100),
})

type LoginForm = z.infer<typeof formSchema>

export default function Login() {
  const form = useForm<LoginForm>({ resolver: zodResolver(formSchema), defaultValues: { username: "", password: "" } })

  const onSubmit = async (data: LoginForm) => {
    const res = await api.login(data)
    if (res.error) {
      form.setError("root", { message: res.error })
    } else {
      console.log("Login successful:", res)
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
