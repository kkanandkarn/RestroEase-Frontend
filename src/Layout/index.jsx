import toast, { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";
import { CiUser } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import "./styles.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfileModal from "../components/Models/ProfileModal";
import Sidebar from "./Sidebar";
import NotificationModal from "../components/Models/NotificationModal";
import { CRUDAPI } from "../apiCalls/crud-api";
import { useNavigate } from "react-router-dom";
import socket from "../Socket";
import {
  VIEW_UNREAD_NOTIFICATIONS,
  VIEW_UNREAD_NOTIFICATIONS_METHOD,
} from "../apiCalls/endpoints";

const Layout = ({ children, title = "Restaurant-ERP" }) => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const [profileModal, setProfileModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for new notifications
    socket.on("notificationCount", (count) => {
      console.log("Updated notification count received:", count);
      setNotificationCount(count);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("notificationCount");
    };
  }, [navigate]);

  useEffect(() => {
    const getUnreadNotificationCount = async () => {
      try {
        const response = await CRUDAPI(
          VIEW_UNREAD_NOTIFICATIONS,
          VIEW_UNREAD_NOTIFICATIONS_METHOD,
          null,
          navigate
        );
        if (response.status === "SUCCESS") {
          setNotificationCount(response.data.totalCount);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUnreadNotificationCount();
  }, []);

  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="h-screen flex bg-white">
        <Toaster position="top-center" reverseOrder={false} />
        <div className=" h-full">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-16 bg-white w-full flex justify-between items-center px-4 border-b-2 border-b-gray-400">
            <div>
              <div className="font-Poppins font-bold font-poppins text-2xl text-black py-4">
                {authData?.role} {">"} {title}
              </div>
            </div>
            <div className="flex relative">
              <div
                className="hover:bg-zinc-300 hover:text-slate-900 rounded-full p-2 mr-4 text-slate-900 cursor-pointer ease-in-out duration-300"
                onClick={() => setNotificationModal(true)}
              >
                <IoIosNotificationsOutline size={24} />
                {notificationCount > 0 && (
                  <div className="absolute w-4 h-4 flex justify-center items-center rounded-full text-xs font-Poppins font-bold text-white bg-red-400 top-1 left-5">
                    {notificationCount}
                  </div>
                )}
              </div>
              <div
                className="hover:bg-zinc-300 hover:text-slate-900 rounded-full p-2 text-slate-900 cursor-pointer ease-in-out duration-300"
                onClick={() => setProfileModal(true)}
              >
                <CiUser size={24} />
              </div>
              <ProfileModal
                isOpen={profileModal}
                onClose={() => setProfileModal(false)}
              />
              {notificationModal && (
                <NotificationModal
                  isOpen={notificationModal}
                  onClose={() => {
                    setNotificationCount(0);
                    setNotificationModal(false);
                  }}
                />
              )}
            </div>
          </div>
          <div className="content-container overflow-auto bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
