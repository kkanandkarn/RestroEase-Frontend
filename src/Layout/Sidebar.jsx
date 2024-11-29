import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useReload from "../hooks/useReload";
import { sidebarItems } from "./sidebar-items";
import { setSidebar } from "../store/sidebarSlice";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const Sidebar = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const sidebar = useSelector((state) => state.sidebar);
  const [sidebarOpen, setSidebarOpen] = useState(sidebar.sidebarOpen);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState();

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (!token) navigate("/");

    const filteredItems = sidebarItems.filter((item) =>
      item.roles.includes(authData?.role)
    );

    if (!menuItems || (menuItems && !menuItems.length)) {
      setMenuItems(filteredItems);
    }
  }, []);

  useEffect(() => {
    setSidebarOpen(sidebar.sidebarOpen);
  }, [sidebar]);

  const handleMenuClick = (route) => navigate(route);

  const handleSidebar = () => {
    dispatch(setSidebar({ sidebarOpen: !sidebarOpen }));
  };

  const isActiveMenu = (route) => location.pathname.includes(route);

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-primaryColor text-white h-screen duration-300 ease-in-out`}
    >
      <div className="flex justify-end">
        <button
          className="bg-white text-primaryColor mt-4 px-2 py-1 rounded-l-lg ease-in-out duration-300"
          onClick={handleSidebar}
        >
          {sidebarOpen ? (
            <IoIosArrowBack size={20} />
          ) : (
            <IoIosArrowForward size={20} />
          )}
        </button>
      </div>
      <div
        className={`flex flex-col justify-start ${
          sidebarOpen && "items-center"
        } mb-4 px-4 ease-in-out duration-300`}
      >
        <img
          src={authData?.tenantLogo}
          alt="logo"
          className={`${sidebarOpen ? "w-20 h-20" : "w-10 h-10"} duration-300`}
        />
        {sidebarOpen && (
          <h1 className="font-Poppins text-sm font-bold mt-2">
            {authData?.tenantName}
          </h1>
        )}
      </div>
      <ul className="px-4 ease-in-out duration-300">
        {menuItems?.map((menuItem) => (
          <li
            key={menuItem.name}
            className={`mb-4 cursor-pointer`}
            onClick={() => handleMenuClick(menuItem.route)}
          >
            <div
              className={`text-left px-4 py-2 rounded-md font-Poppins flex items-center gap-2 text-white ${
                isActiveMenu(menuItem.route) ? "bg-slate-800" : ""
              }`}
              data-tooltip-id={`tooltip-${menuItem.name}`} // Tooltip ID
              data-tooltip-content={menuItem.name} // Tooltip Content
            >
              <div
                className={`${
                  isActiveMenu(menuItem.route) ? "text-orange-400" : ""
                }`}
              >
                {menuItem.icon}
              </div>
              {sidebarOpen && menuItem.name}
            </div>

            {!sidebarOpen && (
              <Tooltip id={`tooltip-${menuItem.name}`} place="right" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
