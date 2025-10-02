
import { isAdminAuthenticated } from "../../auth-check";
import httpClient from "../../axios.config";

const DashboardLoader = async ({ request }: { request: Request }) => {
    isAdminAuthenticated(request);
  try {
    let result = httpClient.get(`/api/dashboard`);

    return (await result).data;
  } catch (error) {}
};

export {DashboardLoader};