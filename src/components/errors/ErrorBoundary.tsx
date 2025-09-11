import { Component, type ReactNode } from "react"
import { ErrorDisplay } from "./ErrorDisplay"

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
  /**
   * Change this value (e.g. route pathname) to auto-reset the boundary.
   */
  resetKey?: unknown
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
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

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.reset()
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset)
      }

      return <ErrorDisplay error={this.state.error} />
    }

    return this.props.children
  }
}
