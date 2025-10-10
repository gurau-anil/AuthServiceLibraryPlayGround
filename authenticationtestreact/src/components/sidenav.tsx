import { Box, type BoxProps } from "@chakra-ui/react";
import AppMenu from "./menu";
import type { MenuItemModel } from "./menu-item3";
import layoutPreference from "../layouts/layout-consts";

interface SidenavProps extends BoxProps{
    menuItem: MenuItemModel[],
    sideNavCollapsed: boolean;
    background?: string;
    textColor?: string;
    collapsedWidth?: string;
    onMenuItemClicked?: (data: MenuItemModel) => void
}
function SideNav({ menuItem, sideNavCollapsed, background = "white", textColor= "black", onMenuItemClicked}: SidenavProps) {
  return (
    <>
      <Box
        transition="width 0.5s ease"
        bg={background}
        color={textColor}
        w={sideNavCollapsed ? 20 : 60}
        h="full"
        pt={4}
        pos="fixed"
        top={"5rem"}
        shadow="inset"
        display={{ base: "none", md: "block" }}
      > 
      <Box height={"calc(100vh - 6rem)"} w={"full"} overflowY={"auto"} pb={"2rem"} px={4}>
        <AppMenu data={menuItem} 
          sideNavCollapsed={sideNavCollapsed} 
          color={layoutPreference.Menu.textColor}
          onMenuItemClicked={onMenuItemClicked}
          />
      </Box>
          
      </Box>
    </>
  );
}

export default SideNav;
