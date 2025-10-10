import type { RouteObject } from "react-router";
import httpClient from "../axios.config";
import AuthLayout from "../layouts/auth-layout";
import EmailConfirmationPage from "../pages/email-confirmation-page";
import LoginPage from "../pages/login-page";
import RegisterPage from "../pages/user-register-page";
import TwoFactorAuthPage from "../pages/two-factor-auth-page";
import ForgotPasswordPage from "../pages/forgot-password-page";
import ResetPasswordPage from "../pages/reset-password-page";

const authRoutes: RouteObject[] = [
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
            Component: TwoFactorAuthPage,
          },
          {
            path: "register",
            Component: RegisterPage,
          },
          {
            path: "forgot-password",
            Component: ForgotPasswordPage,
          },
          {
            path: "reset-password",
            Component: ResetPasswordPage,
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
      }
];


export default authRoutes;