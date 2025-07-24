import { createBrowserRouter, redirect, useNavigate } from "react-router";
import App from "./App";
import LoginPage from "./pages/login-page";
import AboutPage from "./pages/about-page";
import httpClient from "./axios.config";

function isUserAuthenticated(request:Request){
    const token = localStorage.getItem('bearer-token');
    if (!token) {
        const url = new URL(request.url);
        throw redirect(`/auth/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
    }
    return null;
}

const AppLoader = async ({ request }: { request: Request }) => {
    isUserAuthenticated(request);
    try {


        const result: any = await httpClient.get("pokemon/ditto", {
            baseURL : "https://pokeapi.co/api/v2"
        });

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
