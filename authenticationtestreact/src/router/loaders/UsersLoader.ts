import { isAdminAuthenticated } from "../../auth-check";
import { getUsers } from "../../services/user-service";

const UsersLoader = async ({ request }: { request: Request }) => {
  isAdminAuthenticated(request);

  try {
    return await getUsers();
  } catch (error) {}
};

export {UsersLoader};