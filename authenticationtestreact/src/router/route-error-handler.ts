import { redirect } from "react-router";

export function HandleError(statusCode: number) {
  switch (statusCode) {
    case 401:
      throw redirect("/auth/login");
      break;

    default:
      break;
  }
}