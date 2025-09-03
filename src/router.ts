import { createBrowserRouter } from "react-router"
import Home from "./components/pages/Home"
import Login from "./components/pages/Login"
import Layout from "./components/layout/Layout"

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    Component: Layout,
    children: [{ index: true, Component: Home }],
  },
])
