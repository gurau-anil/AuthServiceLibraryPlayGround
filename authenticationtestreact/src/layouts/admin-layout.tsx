import { Outlet, useNavigate } from "react-router";
import httpClient from "../axios.config";
import "./layout.css";
import { useState } from "react";
import { OpenToast } from "../utilities/toast";
import {Box} from "@chakra-ui/react";
import Header from "../components/header";
import SideNav from "../components/sidenav";
import AppLoader from "../components/app-loader";
import { GetMenuItemData } from "./menu-data";
import AppMenu from "../components/menu";
import AppDrawer from "../components/app-drawer";
import layoutPreference, { type layoutPreferenceType } from "./layout-consts";
import type { MenuItemModel } from "../components/menu-item3";

function AdminLayout() {
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

  async function handleMenuItemClick(data: MenuItemModel){
    if(data.link){
        setShowDrawer(false);
        navigate(data.link);
    }
  }
  const menuItemData = GetMenuItemData();
  return (
    <>
    <AppLoader show={loading}/>

      <Box h="100vh">
      {/* header section */}
      <Header hasCollapseIcon={true} 
        isSideNavDefault={layoutPreference.defaultNavMode === "sidenav"}
        sideNavCollapsed={sideNavCollapsed} 
        onSideNavCollapseTriggered={()=> {
            setSideNavCollapsed(!sideNavCollapsed);

            setTimeout(() => {
                layoutPreference.sideNav.isCollapsed = !sideNavCollapsed;
                localStorage.setItem("preference", JSON.stringify(layoutPreference));
            });
        }}
        onDrawerTriggered={()=> setShowDrawer(!showDrawer)} 
        onLogOutAction={logout}/>

      {/* side nav */}
      {layoutPreference.defaultNavMode === "sidenav" && (
          <SideNav menuItem={menuItemData} 
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
          ml={layoutPreference.defaultNavMode === 'sidenav' ? {base: 0, md: sideNavCollapsed? 20 : 60} : 0}
          p="4"
          pt={"6rem"}
          h={"full"}
        >
          <Outlet/>
        </Box>

        <AppDrawer onOpenChanged={(data: boolean)=> setShowDrawer(data)} show={showDrawer} title="App Menu">
            <AppMenu data={menuItemData} sideNavCollapsed={false} onMenuItemClicked={handleMenuItemClick}/>
        </AppDrawer>
      </Box>
    </>
  );
}

export default AdminLayout;
