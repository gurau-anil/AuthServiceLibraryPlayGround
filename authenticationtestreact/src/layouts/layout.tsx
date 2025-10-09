import { Outlet, useNavigate } from "react-router";
import httpClient from "../axios.config";
import "./layout.css";
import { useEffect, useState } from "react";
import { OpenToast } from "../utilities/toast";
import {Box,Container,useBreakpointValue} from "@chakra-ui/react";
import Header from "../components/header";
import AppLoader from "../components/app-loader";

function Layout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [sideNavCollapsed, setSideNavCollapsed] = useState<boolean>(false);
  const isDesktop = useBreakpointValue({ base: false, md: true });

  useEffect(() => {
    setSideNavCollapsed(!isDesktop);
  }, [isDesktop]);
  
  async function logout() {
    try {
      setLoading(true);
      await httpClient.get("api/auth/logout");
      OpenToast("error", "Logged Out");
      localStorage.removeItem("authResult");
      navigate("/auth/login");
    } catch (error: any) {
      setLoading(false);
    }
  }

  return (
    <>
    <AppLoader show={loading}></AppLoader>
      <Box h="100vh" bg={"gray.200"}>
      <Header sideNavCollapsed={sideNavCollapsed} onSideNavCollapseTriggered={()=> 
        setSideNavCollapsed(!sideNavCollapsed)} onLogOutAction={logout}></Header>
      {/* <SideNav sideNavCollapsed={sideNavCollapsed}></SideNav> */}
        {/* Body */}
        <Box
          bg={"ghostwhite"}
          transition="margin 0.8s ease"
          p="4"
          h="calc(100vh)"
          pt={"6rem"}
        >
          <Container fluid>
            <Outlet></Outlet>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default Layout;
