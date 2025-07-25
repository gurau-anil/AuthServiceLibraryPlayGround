import { createBrowserRouter, redirect, useNavigate } from "react-router";
import App from "./App";
import LoginPage from "./pages/login-page";
import AboutPage from "./pages/about-page";
import httpClient from "./axios.config";
import isUserAuthenticated from "./auth-check";

const AppLoader = async ({ request }: { request: Request }) => {
    isUserAuthenticated(request);
    try {
        const result: any = await httpClient.get("api/role/all");

        return result.data;
    } catch (error) {
        console.error(error);
        
    }
    
  };
  
const router = createBrowserRouter([
    {
      path: "/",
      Component: App,
      loader: AppLoader
    },
    {
        path: "about",
        Component: AboutPage,
        loader: async ({request}: {request: Request})=>{
            isUserAuthenticated(request);
        }
      },

    {
      path: "/auth/login",
      Component: LoginPage
    },

  ]);

  export default router;
