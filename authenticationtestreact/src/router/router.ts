import { createBrowserRouter, redirect } from "react-router";
import App from "../App";
import LoginPage from "../pages/login-page";
import AboutPage from "../pages/about-page";
import httpClient from "../axios.config";
import isUserAuthenticated, { isAdminAuthenticated } from "../auth-check";
import Layout from "../layouts/layout";
import ForgotPassword from "../pages/forgot-password";
import ResetPassword from "../pages/reset-password";
import RegisterPage from "../pages/register";
import EmailConfirmationPage from "../pages/email-confirmation";
import AuthLayout from "../layouts/auth-layout";
import BaseLayout from "../layouts/base-layout";
import UserHomePage from "../pages/UserHomePage";
import AdminLayout from "../layouts/admin-layout";
import AdminDashboard from "../pages/admin/dashboard";
import UserExplorePage from "../pages/UserExplorePage";
import NotFoundPage from "../pages/notfound";
import { EmailType } from "../enums/email-type";
import EmailTemplatePage from "../pages/EmailTemplatePage";
import EmailSettingsPage from "../pages/admin/settings/email-settings";
import { SettingsLoader } from "./loaders/SettingsLoader";
import { DashboardLoader } from "./loaders/DashboardLoader";
import TwoFactorAuth from "../pages/two-factor-auth";

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
            loader: async ({ request }: { request: Request }) => {
              // isUserAuthenticated(request);
            },
          },
        ],
      },
      {
        path: "/admin",
        Component: AdminLayout,
        loader: async ({ request }: { request: Request }) => {
          isAdminAuthenticated(request);
        },
        children: [
          {
            path: "",
            Component: AdminDashboard,
            loader: DashboardLoader
          },
          {
            path: "user/home",
            Component: UserHomePage,
          },
          {
            path: "user/explore",
            Component: UserExplorePage,
          },
          {
            path: "email-template",
            Component: EmailTemplatePage,
            loader: async ({ request }: { request: Request }) => {
              isAdminAuthenticated(request);

              try {
                var result = await Promise.all([
                  httpClient.get(`/api/merge-field?emailType=${EmailType.EmailConfirmation}`),
                  httpClient.get(`/api/email-template?emailType=${EmailType.EmailConfirmation}`),
                ]);

                return {
                  mergeFields: result[0].data,
                  emailTemplate: result[1].data,
                };
              } catch (error: any) {
                HandleError(error.status);
              }
            },
          },
          {
            path: "settings",
            Component: EmailSettingsPage,
            loader: SettingsLoader
          }
        ],
      },
      {
        path: "/auth",
        Component: AuthLayout,
        children: [
          {
            path: "login",
            Component: LoginPage,
          },
          {
            path: "two-factor-auth",
            Component: TwoFactorAuth,
          },
          {
            path: "register",
            Component: RegisterPage,
          },
          {
            path: "forgot-password",
            Component: ForgotPassword,
          },
          {
            path: "reset-password",
            Component: ResetPassword,
          },
          {
            path: "confirm-email",
            Component: EmailConfirmationPage,
            loader: async ({ request }: { request: Request }) => {
              const url = new URL(request.url);
              const email: string = url.searchParams.get("email") ?? "";
              const token: string = url.searchParams.get("token") ?? "";
              try {
                const result = await httpClient.get(
                  `api/auth/confirm-email?email=${email}&token=${token}`
                );
                return { data: result.data };
              } catch (error: any) {
                return { error: { message: error?.response?.data?.errors[0] } };
              }
            },
          },
        ],
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);

export default router;
