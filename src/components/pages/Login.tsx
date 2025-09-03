import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>DemoForums</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 w-64">
            <Input placeholder="username" autoFocus />
            <Input type="password" placeholder="password" />
            <Button>Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
