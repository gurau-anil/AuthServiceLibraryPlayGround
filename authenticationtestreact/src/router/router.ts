import { createBrowserRouter } from "react-router";
import App from "../App";
import AboutPage from "../pages/about-page";
// import isUserAuthenticated from "../auth-check";
import Layout from "../layouts/layout";
import BaseLayout from "../layouts/base-layout";
import NotFoundPage from "../pages/notfound-page";
import adminRoutes from "./admin-router";
import authRoutes from "./auth-router";
import isUserAuthenticated from "../auth-check";

const AppLoader = async ({ request }: { request: Request }) => {
  isUserAuthenticated(request);
};

const router = createBrowserRouter([
  {
    Component: BaseLayout,
    children: [
      {
        Component: Layout,
        children: [
          {
            path: "/",
            Component: App,
            loader: AppLoader,
          },
          {
            path: "about",
            Component: AboutPage,
            // loader: async ({ request }: { request: Request }) => {
            //   // isUserAuthenticated(request);
            // },
          },
        ],
      },
      ...adminRoutes,
      ...authRoutes
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);

export default router;
