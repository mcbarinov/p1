import { createBrowserRouter } from "react-router"
import Home from "./components/pages/Home"
import Login from "./components/pages/Login"
import Layout from "./components/layout/Layout"
import ListPosts from "./components/pages/ListPosts"

export const createRouter = () =>
  createBrowserRouter([
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/",
      Component: Layout,
      HydrateFallback: () => null,
      children: [
        {
          index: true,
          Component: Home,
        },
        {
          path: "forums/:slug",
          Component: ListPosts,
        },
      ],
    },
  ])
