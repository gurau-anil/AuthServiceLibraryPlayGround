import { isAdminAuthenticated } from "../../auth-check";
import httpClient from "../../axios.config";

const UsersLoader = async ({ request }: { request: Request }) => {
  isAdminAuthenticated(request);

  try {
    let result = httpClient.get(`/api/user/get-all`);

    return (await result).data;
  } catch (error) {}
};

export {UsersLoader};