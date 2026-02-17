import { isAdminAuthenticated } from "../../auth-check";
import { getHistory } from "../../services/history-service";
import { HandleError } from "../route-error-handler";

const HistoryLoader = async ({ request }: { request: Request }) => {
  isAdminAuthenticated(request);

  try {
    return await getHistory();
  } catch (error: any) {
    HandleError(error?.response?.status);
  }
};

export { HistoryLoader };
