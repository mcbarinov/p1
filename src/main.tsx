import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import { RouterProvider } from "react-router"
import { createRouter } from "./router"
import { forumsQueryOptions, usersQueryOptions } from "./lib/queries"
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
  const queryClient = new QueryClient()

  // Initialize auth from localStorage
  const authData = authStorage.getAuthData()
  if (authData) {
    queryClient.setQueryData(["currentUser"], authData)

    // Prefetch critical data only if authenticated
    // This ensures users and forums are loaded once at app start
    try {
      await Promise.all([queryClient.prefetchQuery(forumsQueryOptions()), queryClient.prefetchQuery(usersQueryOptions())])
    } catch (error) {
      // If prefetch fails (likely 401), the afterResponse hook will handle redirect
      console.error("Failed to prefetch data:", error)
    }
  }

  // Render the app after MSW is ready
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  )
}

void startApp()
