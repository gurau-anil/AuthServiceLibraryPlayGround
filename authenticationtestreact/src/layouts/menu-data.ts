import { FiLayout, FiUsers, FiSettings, FiBriefcase, FiClock, FiEdit, FiMail } from "react-icons/fi";

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
          expanded: false
        },
      ],
    },
    {
      name: "History",
      icon: FiClock 
    },
    {
      name: "Templates",
      icon: FiMail
    },
    {
      name: "Settings",
      icon: FiSettings,
      submenu: [],
    },
  ];
};

export { GetMenuItemData };
