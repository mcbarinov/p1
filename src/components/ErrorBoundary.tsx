import { Component, type ReactNode, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router"

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary that automatically resets when the route changes.
 * This ensures users can navigate away from error pages by clicking links.
 */
export function ErrorBoundary({ children, fallback }: Props) {
  const location = useLocation()
  const resetRef = useRef<(() => void) | null>(null)

  /**
   * Reset error state when route changes
   */
  useEffect(() => {
    if (resetRef.current) {
      resetRef.current()
    }
  }, [location.pathname])

  return (
    <ErrorBoundaryClass fallback={fallback} resetRef={resetRef}>
      {children}
    </ErrorBoundaryClass>
  )
}

interface ErrorBoundaryClassProps extends Props {
  resetRef: React.MutableRefObject<(() => void) | null>
}

class ErrorBoundaryClass extends Component<ErrorBoundaryClassProps, State> {
  constructor(props: ErrorBoundaryClassProps) {
    super(props)
    this.state = { hasError: false, error: null }
    props.resetRef.current = this.reset
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset)
      }

      return (
        <div className="container mx-auto p-6">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <h2 className="text-2xl font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground text-center max-w-md">
              {this.state.error.message || "An unexpected error occurred"}
            </p>
            <Button onClick={this.reset}>Try again</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
