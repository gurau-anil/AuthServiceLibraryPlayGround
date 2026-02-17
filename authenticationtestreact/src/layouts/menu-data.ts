import { FiUsers, FiBriefcase, FiClock, FiMail, FiCpu, FiPrinter, FiMessageSquare, FiGrid, FiSliders } from "react-icons/fi";

const GetMenuItemData = () => {
  return [
    {
      name: "Dashboard",
      icon: FiGrid,
      // icon: FiLayout,
      link: "/admin",
    },
    {
      name: "Users",
      icon: FiUsers,
      submenu: [
        { name: "Manage", expanded: false, link: "/admin/user/manage" },
        { name: "Activity", expanded: false },
        { name: "Permission", expanded: false },
        { name: "Support Request", expanded: false },
        { name: "Explore", expanded: false },
      ],
    },
    {
      name: "Roles",
      icon: FiBriefcase,
      submenu: [
        { name: "Manage", expanded: false, link: "/admin/role/manage" },
        { name: "Permission", expanded: false},
        { name: "Explore", expanded: false},
      ],
    },
    {
      name: "History",
      icon: FiClock,
      link: "/admin/history"
    },
    {
      name: "Email Templates",
      icon: FiMail,
      link: "/admin/email-template"
    },
    {
      name: "Automate",
      icon: FiCpu,
    },
    {
      name: "Reporting",
      icon: FiPrinter,
    },
    {
      name: "Feedbacks",
      icon: FiMessageSquare 
    },
    {
      name: "Settings",
      // icon: FiSettings,
      icon: FiSliders,
      submenu: [
        { name: "General", expanded: false, link: "/admin/settings/general" },
        { name: "Email", expanded: false, link: "/admin/settings/email" },
        { name: "Account", expanded: false, link: "/admin/settings/account" },
        { name: "Registration", expanded: false, link: "/admin/settings/registration" },
      ],
    },
  ];
};

export { GetMenuItemData };
