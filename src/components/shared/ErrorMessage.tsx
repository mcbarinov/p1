import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AppError } from "@/lib/errors"

interface ErrorMessageProps {
  error: unknown
  customMessage?: (error: AppError) => string | undefined
}

export function ErrorMessage({ error, customMessage }: ErrorMessageProps) {
  if (!error) return null

  const appError = AppError.fromUnknown(error)
  const message = customMessage?.(appError) ?? appError.message

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>Error! {message}</AlertDescription>
    </Alert>
  )
}
