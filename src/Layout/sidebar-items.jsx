import { MdDashboard } from "react-icons/md";
import { MdOutlineInventory2 } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { RiBillLine } from "react-icons/ri";
import { RiAlignItemLeftFill } from "react-icons/ri";
import { TbUserSquare } from "react-icons/tb";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { FaRegWindowRestore } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
export const sidebarItems = [
  {
    name: "Dashboard",
    icon: <MdDashboard />,
    route: "/dashboard",
    roles: ["Admin", "Reception", "Waiter"],
  },
  {
    name: "Inventory",
    icon: <MdOutlineInventory2 />,
    route: "/inventory",
    roles: ["Admin"],
  },
  {
    name: "Users",
    icon: <GoPeople />,
    route: "/users",
    roles: ["Admin"],
  },
  {
    name: "Cart",
    icon: <FaShoppingCart />,
    route: "/cart",
    roles: ["Reception"],
  },
  {
    name: "Billing",
    icon: <RiBillLine />,
    route: "/billing",
    roles: ["Admin", "Reception"],
  },
  {
    name: "Category",
    icon: <RiAlignItemLeftFill />,
    route: "/category",
    roles: ["Admin"],
  },
  {
    name: "Roles",
    icon: <TbUserSquare />,
    route: "/roles",
    roles: ["Admin"],
  },
  {
    name: "Tables",
    icon: <MdOutlineTableRestaurant />,
    route: "/tables",
    roles: ["Admin"],
  },
  {
    name: "Services",
    icon: <FaRegWindowRestore />,
    route: "/services",
    roles: ["Admin"],
  },
];
