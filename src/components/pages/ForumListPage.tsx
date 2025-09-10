import type { Forum } from "@/types"
import { Link } from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export default function Home() {
  const { data: forums } = useSuspenseQuery(api.queries.forums())

  const groupedForums = forums.reduce<Record<string, Forum[]>>((acc, forum) => {
    acc[forum.category] ??= []
    acc[forum.category].push(forum)
    return acc
  }, {})

  return (
    <div className="container mx-auto py-8">
      {Object.entries(groupedForums).map(([category, categoryForums]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-muted-foreground">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryForums.map((forum) => (
              <Link key={forum.id} to={`/forums/${forum.slug}`} className="block hover:no-underline">
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader>
                    <CardTitle className="text-lg">{forum.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{forum.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
