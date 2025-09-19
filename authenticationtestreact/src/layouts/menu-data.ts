import { FiLayout, FiUsers, FiSettings, FiBriefcase } from "react-icons/fi";

const GetMenuItemData = () => {
  return [
    {
      name: "Dashboard",
      icon: FiLayout,
      link: "/admin",
    },
    {
      name: "Users",
      icon: FiUsers,
      submenu: [
        { name: "Home2", expanded: false, link: "/admin/user/home" },
        { name: "Explore", expanded: false },
      ],
    },
    {
      name: "Roles",
      icon: FiBriefcase,
      submenu: [
        { name: "Explore1", expanded: false },
        {
          name: "Trade",
          expanded: false,
          submenu: [
            { name: "Trade1", expanded: false },
            { name: "Trade2", expanded: false, link: "/admin/user/explore" },
          ],
        },
      ],
    },
    {
      name: "Settings",
      icon: FiSettings,
      submenu: [],
    },
  ];
};

export { GetMenuItemData };
