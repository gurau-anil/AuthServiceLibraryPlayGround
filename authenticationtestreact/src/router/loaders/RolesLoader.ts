import { isAdminAuthenticated } from "../../auth-check";
import { getRoles } from "../../services/role-service";
import { HandleError } from "../route-error-handler";

const RolesLoader = async ({ request }: { request: Request }) => {
  isAdminAuthenticated(request);

  try {
    return await getRoles();
  } catch (error: any) {
    HandleError(error?.response?.status);
  }
};

export { RolesLoader };
