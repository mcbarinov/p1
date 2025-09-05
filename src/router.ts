import { createBrowserRouter } from "react-router"
import ForumListPage from "./components/pages/ForumListPage"
import LoginPage from "./components/pages/LoginPage"
import Layout from "./components/layout/Layout"
import PostListPage from "./components/pages/PostListPage"
import ForumCreatePage from "./components/pages/ForumCreatePage"

export const createRouter = () =>
  createBrowserRouter([
    {
      path: "/login",
      Component: LoginPage,
    },
    {
      path: "/",
      Component: Layout,
      HydrateFallback: () => null,
      children: [
        {
          index: true,
          Component: ForumListPage,
        },
        {
          path: "forums/new",
          Component: ForumCreatePage,
        },
        {
          path: "forums/:slug",
          Component: PostListPage,
        },
      ],
    },
  ])
