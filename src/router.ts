import { createBrowserRouter } from "react-router"
import ForumListPage from "./components/pages/ForumListPage"
import LoginPage from "./components/pages/LoginPage"
import Layout from "./components/layout/Layout"
import PostListPage from "./components/pages/post-list/PostListPage"
import ForumCreatePage from "./components/pages/ForumCreatePage"
import PostCreatePage from "./components/pages/PostCreatePage"
import PostViewPage from "./components/pages/post-view/PostViewPage"

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
        {
          path: "forums/:slug/new",
          Component: PostCreatePage,
        },
        {
          path: "forums/:slug/:postNumber",
          Component: PostViewPage,
        },
      ],
    },
  ])
