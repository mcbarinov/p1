import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import { RouterProvider } from "react-router"
import { createRouter } from "./router"
import { api } from "./lib/api"
import { authStorage } from "./lib/auth-storage"

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
      </QueryClientProvider>
    </StrictMode>
  )
}

void startApp()
