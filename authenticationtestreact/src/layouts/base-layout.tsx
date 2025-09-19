import { Outlet } from "react-router";
import { Toaster } from "../components/ui/toaster";

function BaseLayout() {
    return ( 
    <>
    {/* <div style={{background: "black", position: "absolute", height:"100vh", width: "100vw", inset:"0", zIndex: "100"}}></div> */}
    <Toaster/>
    <Outlet></Outlet>
    </>);
}

export default BaseLayout;