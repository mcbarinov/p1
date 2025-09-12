import { AlertCircle, AlertTriangle, WifiOff, XCircle } from "lucide-react"
import { AppError } from "@/lib/errors"

interface ErrorDisplayProps {
  error: unknown
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const appError = AppError.fromUnknown(error)
  const title = appError.title

  const getIcon = () => {
    switch (appError.code) {
      case "network_error":
        return <WifiOff className="h-12 w-12 text-muted-foreground" />
      case "server_error":
        return <AlertTriangle className="h-12 w-12 text-destructive" />
      case "not_found":
        return <XCircle className="h-12 w-12 text-muted-foreground" />
      case "unauthorized":
      case "forbidden":
        return <AlertCircle className="h-12 w-12 text-warning" />
      default:
        return <AlertCircle className="h-12 w-12 text-muted-foreground" />
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        {getIcon()}

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-muted-foreground max-w-md">{appError.message}</p>
        </div>
      </div>
    </div>
  )
}
