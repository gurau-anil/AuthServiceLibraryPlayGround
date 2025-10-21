import { Outlet } from "react-router";
import { Toaster } from "../components/ui/toaster";

function BaseLayout() {
    return ( 
    <>
    <Toaster/>
    <Outlet></Outlet>
    </>);
}

export default BaseLayout;