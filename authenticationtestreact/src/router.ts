import { createBrowserRouter, redirect, useNavigate } from "react-router";
import App from "./App";
import LoginPage from "./pages/login-page";
import AboutPage from "./pages/about-page";
import httpClient from "./axios.config";
import isUserAuthenticated from "./auth-check";
import Layout from "./layouts/layout";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import RegisterPage from "./pages/register";

const AppLoader = async ({ request }: { request: Request }) => {
  isUserAuthenticated(request);
  try {
    const result: any = await httpClient.get("api/role/all");

    return result.data;
  } catch (error: any) {
    console.log(error)
    HandleError(error.status);
  }
};

function HandleError(statusCode: number) {
  switch (statusCode) {
    case 401:
      throw redirect("/auth/login");
      break;

    default:
      break;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "",
        Component: App,
        loader: AppLoader
      },
      {
        path: "about",
        Component: AboutPage,
        loader: async ({ request }: { request: Request }) => {
          isUserAuthenticated(request);
        },
      },
    ],
  },
  {
    path: "/auth/login",
    Component: LoginPage,
  },
  {
    path: "/auth/register",
    Component: RegisterPage,
  },
  {
    path: "/auth/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/auth/reset-password",
    Component: ResetPassword,
  },
]);

export default router;
