import { useEffect, useState } from "react"
import { AlertCircle, AlertTriangle, WifiOff, XCircle } from "lucide-react"
import { parseError, getErrorTitle, ErrorGroup, type AppError } from "@/lib/errors"

interface ErrorDisplayProps {
  error: unknown
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const [appError, setAppError] = useState<AppError | null>(null)

  useEffect(() => {
    void parseError(error).then(setAppError)
  }, [error])

  if (!appError) {
    return null
  }

  const title = getErrorTitle(appError.group)

  const getIcon = () => {
    switch (appError.group) {
      case ErrorGroup.NETWORK_ERROR:
        return <WifiOff className="h-12 w-12 text-muted-foreground" />
      case ErrorGroup.SERVER_ERROR:
        return <AlertTriangle className="h-12 w-12 text-destructive" />
      case ErrorGroup.NOT_FOUND:
        return <XCircle className="h-12 w-12 text-muted-foreground" />
      case ErrorGroup.UNAUTHORIZED:
      case ErrorGroup.FORBIDDEN:
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
