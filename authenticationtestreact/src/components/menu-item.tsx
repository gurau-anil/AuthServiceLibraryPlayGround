import { Menu, Show, IconButton, Icon, Box, type MenuItemProps, Text, Collapsible } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import HoverBox from "./hover-box";

export interface MenuItemModel {
    name: string, 
    link?: string,
    isActive?: boolean,
    icon?: IconType, 
    expanded?: boolean, 
    submenu?: MenuItemModel[]
}

interface AppMenuItemProps extends MenuItemProps {
    data: MenuItemModel,
    sideNavCollapsed?: boolean, 
    type?: 'menu' | 'submenu', 
    children?: ReactNode,
    color?: string,
    hoverColor?: string,
    background?: string,
    hoverBackground?: string,
    activeBg?: string,
    iconColor?: string,
    toggleIconColor?: string,
    onExpandToggle?: (data: any) => void
    onMenuItemClicked?: (data: MenuItemModel) => void
}
const defaultColor = "gray.700";
// const defaultHoverColor = "gray.800";
// const defaultBg = "green.300";
const defaultActiveBg = "green.300";
const defaultHoverBg = "green.400";

function AppMenuItem({ data, 
    sideNavCollapsed = false,
    type='menu', activeBg=defaultActiveBg, 
    color=defaultColor,
    hoverBackground= defaultHoverBg, 
    iconColor= defaultColor, toggleIconColor= defaultColor, 
    onExpandToggle, onMenuItemClicked}: AppMenuItemProps){
    const isSubmenuActive = data?.submenu?.some(c=>c.isActive);
    const isSubmenu = type === 'submenu' ;
    // let hasActiveBg = type=='menu' ? data.isActive && !sideNavCollapsed : data.isActive && !sideNavCollapsed && !data.submenu;
    // let activeExpandedSubmenu = type=='submenu' && data.isActive;
  return (
  <>
  <Menu.Item key={data.name} 
  p={isSubmenu? 1/2 : 1} 
  value={data.name} 
//   borderLeft={activeExpandedSubmenu?`6px solid` : "unset"}
//   borderLeftColor={activeExpandedSubmenu? activeBg : "unset"}
  bg={data.isActive && !sideNavCollapsed? activeBg :"unset"} 
  _hover={{ bg: sideNavCollapsed ? "unset" : hoverBackground }} 
  
  onClick={()=>onMenuItemClicked?.(data)}
  >
    {/* Menu Item when side nav bar is collapsed  */}
    <Show when={sideNavCollapsed}>
        
        {/* Menu item with no submenu */}
        <Show when={!data.submenu || (data.submenu && data?.submenu?.length == 0)}>
            <IconButton variant={"plain"} 
                bg={data.isActive? activeBg :"unset"} 
                _hover={{ bg: sideNavCollapsed ? hoverBackground : "unset" }} 
                size={type=="submenu"? 'xs' : "md"}>
                <Icon as={data.icon} color={iconColor}/>
            </IconButton>
        </Show>

        {/* Menu item with submenu */}
        <Show when={data.submenu && data?.submenu?.length > 0}>
            <HoverBox trigger={
                <IconButton 
                bg={isSubmenuActive? activeBg :"unset"}
                variant={"plain"} 
                _hover={{ bg: sideNavCollapsed ? hoverBackground : "unset" }} 
                size={type=="submenu"? 'xs' : "md"}
                >
                    <Icon as={data.icon} color={iconColor}/>
                </IconButton>
                }>
            {data?.submenu?.map((link, index) => 
            (
                <AppMenuItem key={link.name+index} data={link} value={link.name+index} onMenuItemClicked={onMenuItemClicked} onExpandToggle={onExpandToggle}/>
            ))}
            </HoverBox>
        </Show>

    </Show>

    {/* Menu Item when side nav bar is not collapsed */}
    <Show when={!sideNavCollapsed}>
        <Show when={data.icon}>
            <IconButton  
            variant={"plain"} 
            size={type=="submenu"? 'xs' : "md"}
            bg={"transparent"}
            >
                <Icon as={data.icon} color={iconColor}/>
            </IconButton>
        </Show>

        {/* menu item text */}
        <Text color={color} transition="opacity 0.3s ease" opacity={sideNavCollapsed ? 0 : 1} my={2} pl={2}>{data.name}</Text>

        {/* expand/collapse icons for menu items with submenu */}
        <Show when={data.submenu && data.submenu.length > 0}>
            <Box pos={"absolute"} 
            d={"inline-block"} 
            h={"25px"} 
            aspectRatio={1} 
            right={2} 
            color={toggleIconColor} 
            textAlign={"center"}
            _hover={{ color: "white" }}
            onClick={(e: any)=> {
                e.stopPropagation();
                onExpandToggle?.({name: data.name})
            }}>
                    <Icon as={data.expanded ? FaCaretDown : FaCaretRight} />
            </Box>
        </Show>

    </Show>
    
    </Menu.Item>

    {/* SUBMENU when side nav bar is not collapsed */}
    <Show when={!sideNavCollapsed}>
        {data?.submenu?.map((sub: any, index) => (
        <Box key={sub.name+index} color={"black"} ml={4} >
        <Collapsible.Root open={data.expanded}>
            <Collapsible.Content>
                <AppMenuItem key={sub.name+index} data={sub} sideNavCollapsed={sideNavCollapsed} type={"submenu"} 
                onMenuItemClicked={onMenuItemClicked} 
                onExpandToggle = {onExpandToggle}
                value={sub.name+index}/>
            </Collapsible.Content>
        </Collapsible.Root>
        </Box>
    ))}
    </Show>
  </>
  );
};

export default AppMenuItem;