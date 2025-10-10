import { createBrowserRouter } from "react-router";
import App from "../App";
import AboutPage from "../pages/about-page";
import httpClient from "../axios.config";
import isUserAuthenticated from "../auth-check";
import Layout from "../layouts/layout";
import BaseLayout from "../layouts/base-layout";
import NotFoundPage from "../pages/notfound-page";
import { EmailType } from "../enums/email-type";
import adminRoutes from "./admin-router";
import authRoutes from "./auth-router";

const AppLoader = async ({ request }: { request: Request }) => {
  isUserAuthenticated(request);

  try {
    var result = await Promise.all([
      httpClient.get(
        `/api/merge-field?emailType=${EmailType.EmailConfirmation}`
      ),
      httpClient.get(
        `/api/email-template?emailType=${EmailType.EmailConfirmation}`
      ),
    ]);

    return { mergeFields: result[0].data, emailContent: result[1].data };
  } catch (error) {}
};

const router = createBrowserRouter([
  {
    Component: BaseLayout,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            path: "",
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
