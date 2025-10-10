import type { RouteObject } from "react-router";
import { isAdminAuthenticated } from "../auth-check";
import httpClient from "../axios.config";
import AdminLayout from "../layouts/admin-layout";
import EmailSettingsPage from "../pages/admin/settings/email-settings-page";
import EmailTemplatePage from "../pages/email-template-page";
import UserExplorePage from "../pages/admin/users/user-explore-page";
import { DashboardLoader } from "./loaders/DashboardLoader";
import { SettingsLoader } from "./loaders/SettingsLoader";
import { EmailType } from "../enums/email-type";
import { HandleError } from "./route-error-handler";
import { UsersLoader } from "./loaders/UsersLoader";
import UserManagePage from "../pages/admin/users/user-manage-page";
import AdminDashboardPage from "../pages/admin/admin-dashboard-page";
import RoleManagePage from "../pages/admin/roles/role-manage-page";

const adminRoutes: RouteObject[] = [
    {
        path: "/admin",
        Component: AdminLayout,
        loader: async ({ request }: { request: Request }) => {
          isAdminAuthenticated(request);
        },
        children: [
          {
            path: "",
            Component: AdminDashboardPage,
            loader: DashboardLoader
          },
          {
            path: "user/manage",
            Component: UserManagePage,
            loader: UsersLoader
          },
          {
            path: "user/explore",
            Component: UserExplorePage,
          },
          {
            path: "role/manage",
            Component: RoleManagePage,
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
];


export default adminRoutes;