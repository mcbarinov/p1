import { Navigate, Outlet } from "react-router"
import { Footer } from "./-components/Footer"
import Header from "./-components/Header"
import { useAuth } from "@/hooks/useAuth"

export default function Layout() {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return (
    <div className="min-h-screen flex flex-col mx-auto w-full max-w-4xl px-6">
      <Header />

      <main className="flex-1 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
