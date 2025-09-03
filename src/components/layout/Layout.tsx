import { Outlet } from "react-router"
import { Footer } from "./-components/Footer"
import Header from "./-components/Header"

export default function Layout() {
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
