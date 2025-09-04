import { createBrowserRouter } from "react-router"
import Home from "./components/pages/Home"
import Login from "./components/pages/Login"
import Layout from "./components/layout/Layout"
import { api } from "./lib/api"
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
          loader: async ({ params }) => {
            const slug = params.slug!
            const [forum, posts, users] = await Promise.all([
              api.getForumBySlug(slug),
              api.getPostsByForumSlug(slug),
              api.getUsers(),
            ])
            return { forum, posts, users }
          },
        },
      ],
    },
  ])
