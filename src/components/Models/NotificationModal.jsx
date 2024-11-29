import React, { useEffect, useRef, useState } from "react";
import { FaTimes, FaCircle, FaCheckCircle } from "react-icons/fa";
import "./styles.css";
import { CRUDAPI } from "../../apiCalls/crud-api";
import { useNavigate } from "react-router-dom";
import {
  VIEW_NOTIFICATIONS,
  VIEW_NOTIFICATIONS_METHOD,
} from "../../apiCalls/endpoints";
import socket from "../../Socket";
import LoadingGif from "../LoadingGif";
import { FaArrowRotateRight } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

const NotificationModal = ({ isOpen, onClose }) => {
  const notificationModalRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [nextLoading, setNextLoading] = useState(false);
  const [totalNotification, setTotalNotifications] = useState(0);

  const fetchNotifications = async (page = 1, next = false) => {
    try {
      next ? setNextLoading(true) : setLoading(true);
      const response = await CRUDAPI(
        VIEW_NOTIFICATIONS,
        VIEW_NOTIFICATIONS_METHOD,
        { page: page, limit: 10 },
        navigate
      );
      if (response.status === "SUCCESS") {
        setTotalNotifications(response.data.totalCount);
        for (const res of response.data.notifications) {
          setNotifications((prevNotifications) => [...prevNotifications, res]);
        }

        setLoading(false);
        setNextLoading(false);
      } else {
        toast.error(response.message);
        setLoading(false);
        setNextLoading(false);
      }
    } catch (error) {
      console.log("error");
      toast.error("Internal server error");
      setLoading(false);
      setNextLoading(false);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    fetchNotifications(1);

    socket.on("notification", (notification) => {
      console.log("New notification received:", notification);
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    return () => {
      socket.off("notification");
    };
  }, [navigate]);

  const handleClickOutside = (event) => {
    if (
      notificationModalRef.current &&
      !notificationModalRef.current.contains(event.target)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleLoadMore = async () => {
    await fetchNotifications(pageNo + 1, true);
    setPageNo(pageNo + 1);
  };

  return (
    <div
      ref={notificationModalRef}
      className="notification-modal w-[450px] absolute bg-white right-16 top-14 flex flex-col rounded-lg shadow-lg transition-transform transform duration-300 ease-in-out"
    >
      <div className="modal-header flex items-center justify-between px-4 py-2 border-b border-gray-300">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <FaTimes />
        </button>
      </div>
      {loading ? (
        <div className="w-full h-36 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-primaryColor">
            {" "}
            <LoadingGif />
          </div>
        </div>
      ) : (
        <ul className="notification-list py-2 w-full overflow-y-auto">
          {notifications.map((nt, index) => (
            <li
              key={index}
              className={`notification-item flex flex-col px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                !nt.isRead ? "font-bold" : ""
              }`}
              onClick={() => navigate(nt.route)}
            >
              <div className="flex items-center gap-2">
                <span>
                  {nt.isRead ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaCircle className="text-blue-500" />
                  )}
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-semibold">
                    {nt.notificationTitle}
                  </span>
                  <span className="text-sm">{nt.notification}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(nt.createdAt)}
                  </span>
                </div>
              </div>
            </li>
          ))}
          {notifications.length !== totalNotification && (
            <li className="flex justify-center">
              {nextLoading ? (
                <div className="w-8 h-8 flex justify-center items-center rounded-full bg-primaryColor">
                  <LoadingGif />
                </div>
              ) : (
                <>
                  <button
                    className="border-2 border-slate-800 rounded-full p-1"
                    id="load-more-btn"
                    onClick={handleLoadMore}
                  >
                    <FaArrowRotateRight size={20} />
                  </button>
                  <Tooltip anchorId="load-more-btn" content="Load More" />
                </>
              )}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default NotificationModal;
