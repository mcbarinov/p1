import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import { RouterProvider } from "react-router"
import { createRouter } from "./router"
import { AuthProvider } from "./contexts/AuthContext"

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

  // Render the app after MSW is ready
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

void startApp()
