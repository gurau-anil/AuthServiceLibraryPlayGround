import { isAdminAuthenticated } from "../../auth-check";
import httpClient from "../../axios.config";

const SettingsLoader = async ({ request }: { request: Request }) => {
  isAdminAuthenticated(request);

  try {
    let result = httpClient.get(`/api/settings`);

    return (await result).data;
  } catch (error) {}
};

export {SettingsLoader};