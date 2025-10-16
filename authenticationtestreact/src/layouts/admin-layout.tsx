import { Outlet, useLocation, useNavigate } from "react-router";
import httpClient from "../axios.config";
import "./layout.css";
import { useEffect, useState } from "react";
import { OpenToast } from "../utilities/toast";
import { Box, HStack, Menu } from "@chakra-ui/react";
import Header from "../components/header";
import SideNav from "../components/sidenav";
import AppLoader from "../components/app-loader";
import { GetMenuItemData } from "./menu-data";
import AppMenu from "../components/menu";
import AppDrawer from "../components/app-drawer";
import layoutPreference, { type layoutPreferenceType } from "./layout-consts";
import type { MenuItemModel } from "../components/menu-item3";
import { FiBriefcase, FiSettings } from "react-icons/fi";
import { useSignalR } from "../hooks/use-signalr";

function AdminLayout() {
  const connection = useSignalR("auth");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [sideNavCollapsed, setSideNavCollapsed] = useState<boolean>(() => {
    try {
      const savedPreference = localStorage.getItem("preference");
      if (savedPreference) {
        const preference: layoutPreferenceType = JSON.parse(savedPreference);
        return preference.sideNav.isCollapsed;
      }
    } catch {}
    return false;
  });
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showSecondaryDrawer, setShowSecondaryDrawer] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  //   const isDesktop = useBreakpointValue({ base: false, md: true });
  
  //   useEffect(() => {
    //     setSideNavCollapsed(!isDesktop);
    //   }, [isDesktop]);
    
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
    
    async function handleMenuItemClick(data: MenuItemModel) {
      if (data.link) {
        setShowDrawer(false);
        navigate(data.link);
      }
    }
    const menuItemData = GetMenuItemData();

    
    useEffect(() => {
      if (!connection) return;
      connection.on("OnlineUserCount", (count: number) => {
        setOnlineUsers(count);
      });

      connection.invoke("GetOnlineUserCount");

      return ()=>{
        connection.off("OnlineUserCount");
      }

    }, [connection]);
    
  return (
    <>
      <AppLoader show={loading} />

      <Box h="100vh" >
        {/* header section */}
        <Header
          extra= {`${onlineUsers}`}
          hasCollapseIcon={true}
          isSideNavDefault={layoutPreference.defaultNavMode === "sidenav"}
          sideNavCollapsed={sideNavCollapsed}
          onSideNavCollapseTriggered={() => {
            setSideNavCollapsed(!sideNavCollapsed);

            setTimeout(() => {
              layoutPreference.sideNav.isCollapsed = !sideNavCollapsed;
              localStorage.setItem(
                "preference",
                JSON.stringify(layoutPreference)
              );
            });
          }}
          onDrawerTriggered={() => setShowDrawer(!showDrawer)}
          onLogOutAction={logout}
        >
          <Menu.Item value="account" p={3} onClick={()=> setShowSecondaryDrawer(true)}>
            <HStack gap={4}>
              <FiBriefcase />
              Account
            </HStack>
          </Menu.Item>
          <Menu.Item value="settings" p={3}>
            <HStack gap={4}>
              <FiSettings />
              Settings
            </HStack>
          </Menu.Item>
        </Header>

        {/* side nav */}
        {layoutPreference.defaultNavMode === "sidenav" && (
          <SideNav
            menuItem={menuItemData}
            sideNavCollapsed={sideNavCollapsed}
            background={layoutPreference?.sideNav?.background}
            textColor={layoutPreference?.sideNav?.textColor}
            onMenuItemClicked={handleMenuItemClick}
          />
        )}

        {/* Body content */}
        <Box
          bg={"ghostwhite"}
          transition="margin 0.5s ease"
          ml={
            layoutPreference.defaultNavMode === "sidenav"
              ? { base: 0, md: sideNavCollapsed ? 20 : 60 }
              : 0
          }
          p="4"
          pt={"6rem"}
          h={"full"}
        >
          <Outlet />
        </Box>

        <AppDrawer
          onOpenChanged={(data: boolean) => setShowDrawer(data)}
          show={showDrawer}
          title="App Menu"
        >
          <AppMenu
            data={menuItemData}
            sideNavCollapsed={false}
            onMenuItemClicked={handleMenuItemClick}
          />
        </AppDrawer>

        <AppDrawer
          onOpenChanged={(data: boolean) => setShowSecondaryDrawer(data)}
          show={showSecondaryDrawer}
          title="Profile"
          placement="end"
          size={{base:"full", md:'sm'}}
        >
          {/* <AppMenu
            data={menuItemData}
            sideNavCollapsed={false}
            onMenuItemClicked={handleMenuItemClick}
          /> */}
        </AppDrawer>
      </Box>
    </>
  );
}

export default AdminLayout;
