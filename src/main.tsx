import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import { RouterProvider } from "react-router"
import { createRouter } from "@/router"
import { api } from "@/lib/api"
import { authStorage } from "@/lib/auth-storage"
import { toast } from "sonner"
import { AppError } from "@/lib/errors"
import { Toaster } from "@/components/ui/sonner"

async function startApp() {
  // Start MSW worker in development and wait for it to be ready
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser")
    await worker.start({
      onUnhandledRequest: "warn",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    })
  }

  // Create router after MSW is ready
  const router = createRouter()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Only show error toasts for background refetches when there's existing data
        // This prevents duplicate error notifications on initial load
        if (query.state.data !== undefined) {
          const appError = AppError.fromUnknown(error)
          toast.error(appError.message)
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        // Log all mutation errors for monitoring
        const appError = AppError.fromUnknown(error)
        console.error("Mutation error:", appError)
      },
    }),
  })

  // Initialize auth from localStorage
  const currentUser = authStorage.getCurrentUser()
  if (currentUser) {
    queryClient.setQueryData(["currentUser"], currentUser)

    // Prefetch critical data only if authenticated
    // This ensures users and forums are loaded once at app start
    try {
      await Promise.all([queryClient.prefetchQuery(api.queries.forums()), queryClient.prefetchQuery(api.queries.users())])
    } catch (error) {
      // If prefetch fails (likely 401), the afterResponse hook will handle redirect
      console.error("Failed to prefetch data:", error)
    }
  }

  // Render the app after MSW is ready
  const rootElement = document.getElementById("root")
  if (!rootElement) throw new Error("Root element not found")

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </StrictMode>
  )
}

void startApp()
