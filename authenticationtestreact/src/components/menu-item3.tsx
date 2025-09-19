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
    background?: string,
    activeBg?: string,
    iconColor?: string,
    toggleIconColor?: string,
    onExpandToggle?: (data: any) => void
    onMenuItemClicked?: (data: MenuItemModel) => void
}
const defaultColor = "black";

function AppMenuItemDraft({ data, sideNavCollapsed = false,
    type='menu', activeBg="green.400", background="green.400", iconColor= defaultColor, toggleIconColor= defaultColor, onExpandToggle, onMenuItemClicked}: AppMenuItemProps){
    const isSubmenuActive = data?.submenu?.some(c=>c.isActive);

  return (<>
  <Menu.Item key={data.name} bg={data.isActive? activeBg :"unset"} value={data.name} _hover={{ bg: sideNavCollapsed ? "" : background }} p={1} 
  onClick={()=>onMenuItemClicked?.(data)}
  >
    {/* menu item with no submenu */}
    <Show when={data.icon && (!data.submenu || data.submenu.length < 1)}>
        <IconButton variant={"plain"} _hover={{ bg: sideNavCollapsed ? background : "unset" }} size={type=="submenu"? 'xs' : "md"}>
            <Icon as={data.icon}/>
        </IconButton>
    </Show>

    {/* menu item with submenu */}
    <>
        {/* shows only when sidenav is collapsed */}
        <Show when={sideNavCollapsed && data.icon && data.submenu && data.submenu.length > 0}>
            <HoverBox trigger={
                <IconButton 
                variant={"plain"} 
                _hover={{ bg: sideNavCollapsed ? background : "unset" }} 
                size={type=="submenu"? 'xs' : "md"}
                borderBottom={isSubmenuActive ? `4px solid` : "0"}
                borderBottomColor={isSubmenuActive? activeBg: 'unset'}
                >
                    <Icon as={data.icon} color={iconColor}/>
                </IconButton>
                }>
            {data?.submenu?.map((link, index) => (<AppMenuItemDraft key={link.name+index} data={link} value={link.name+index} onMenuItemClicked={onMenuItemClicked}/>))}
            </HoverBox>
        </Show>

        {/* shows only when sidenav is not collapsed */}
        <Show when={!sideNavCollapsed && data.icon && data.submenu && data.submenu.length > 0}>
            <IconButton  
            variant={"plain"} 
            _hover={{ bg: sideNavCollapsed ? background : "unset" }} 
            size={type=="submenu"? 'xs' : "md"}
            borderBottom={!data.expanded && isSubmenuActive ? "4px solid" : "0"}
            borderBottomColor={isSubmenuActive? activeBg: 'unset'}
            >
                <Icon as={data.icon} color={iconColor}/>
            </IconButton>
        </Show>
        
        <Text transition="opacity 0.3s ease" opacity={sideNavCollapsed ? 0 : 1} my={2} pl={2}>{data.name}</Text>
    </>
    
    
    {/* submenu expand/collapse icons */}
    <Show when={data.submenu && data.submenu.length > 0 && !sideNavCollapsed}>
        <Box pos={"absolute"} d={"inline-block"} h={6} right={2} color={toggleIconColor} _hover={{ color: "white" }}
        onClick={()=> onExpandToggle?.({name: data.name})}>
                <Icon as={data.expanded ? FaCaretDown : FaCaretRight} />
        </Box>
    </Show>
    </Menu.Item>

    {/* submenu - shown only when sidebar is not collapsed*/}
    <Show when={!sideNavCollapsed}>
        {data?.submenu?.map((sub: any, index) => (
        <Box key={sub.name+index} color={"black"} ml={8} bg={"ghostwhite"}>
        <Collapsible.Root open={data.expanded}>
            <Collapsible.Content>
                <AppMenuItemDraft style={{marginRight:"200px"}} key={sub.name+index} data={sub} sideNavCollapsed={sideNavCollapsed} type={"submenu"} 
                onMenuItemClicked={onMenuItemClicked} 
                value={sub.name+index}/>
            </Collapsible.Content>
        </Collapsible.Root>
        </Box>
    ))}
    </Show>
  </>
  );
};

export default AppMenuItemDraft;