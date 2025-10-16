import {Menu} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import type { MenuItemModel } from "./menu-item3";
import AppMenuItem from "./menu-item";

interface AppMenuProps{
    data: MenuItemModel[],
    sideNavCollapsed: boolean,
    color?: string,
    background?: string,
    subMenuBackground?: string,
    onMenuItemClicked?: (data: MenuItemModel) => void
}

function AppMenu({data, sideNavCollapsed, 
    // color="black", 
    // background="green.400", 
    // subMenuBackground= "ghostwhite"
    onMenuItemClicked
} : AppMenuProps){
    const location = useLocation();

  const [LinkItems, setLinkItems] = useState<MenuItemModel[]>(data);

  useEffect(() => {
  setLinkItems(prev => markActive(prev, location.pathname));
}, [location.pathname]);

function markActive(items: MenuItemModel[], pathname: string): MenuItemModel[] {
  return items.map(item => {
    const isActive = item.link === pathname;

    let updatedSubmenu: MenuItemModel[] | undefined;
    let hasActiveChild = false;

    if (item.submenu && item.submenu.length > 0) {
      updatedSubmenu = markActive(item.submenu, pathname);

      // check if any submenu item is active
      hasActiveChild = updatedSubmenu.some(sub => sub.isActive);
    }

    const isItemActive = isActive || hasActiveChild;

    return {...item,isActive: isItemActive,expanded: isItemActive ? true : item.expanded,submenu: updatedSubmenu};
  });
}


function toggleExpand(items: MenuItemModel[], targetName: string): MenuItemModel[] {
  return items.map(item => {
    if (item.name === targetName) {
      return { ...item, expanded: !item.expanded };
    }
    if (item.submenu) {
      return { ...item, submenu: toggleExpand(item.submenu, targetName) };
    }
    return item;
  });
}

  function onExpandToggle(data: any){
    setLinkItems(prev => toggleExpand(prev, data.name));
  }

  return (
    <>
        <Menu.Root>
          {LinkItems.map((link, index) => (
            <AppMenuItem
            key={link.name+index} 
            data={link} sideNavCollapsed={sideNavCollapsed} 
            onExpandToggle={(data: any) => onExpandToggle(data)} 
            onMenuItemClicked={onMenuItemClicked} 
            value={index+link.name}/>
          ))}
        </Menu.Root>
    </>
  );
}

export default AppMenu;
