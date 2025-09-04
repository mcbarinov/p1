import { api } from "@/lib/api"
import type { Forum } from "@/types"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [forums, setForums] = useState<Forum[]>([])


  useEffect(() => {
    const fetchForums = async () => {
      const data = await api.getForums()
      setForums(data)
    }

    void fetchForums()
  }, [])

  const groupedForums = forums.reduce(
    (acc, forum) => {
      if (!acc[forum.category]) {
        acc[forum.category] = []
      }
      acc[forum.category].push(forum)
      return acc
    },
    {} as Record<string, Forum[]>
  )

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
