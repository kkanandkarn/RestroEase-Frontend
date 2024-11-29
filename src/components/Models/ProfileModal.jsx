import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "./styles.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { TbHomeCog } from "react-icons/tb";
import LoadingGif from "../LoadingGif";
import { CRUDAPI } from "../../apiCalls/crud-api";
import {
  REMOVE_FCM_TOKEN,
  REMOVE_FCM_TOKEN_METHOD,
} from "../../apiCalls/endpoints";

const ProfileModal = ({ isOpen, onClose }) => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const profileModalRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (
      profileModalRef.current &&
      !profileModalRef.current.contains(event.target)
    ) {
      onClose();
    }
  };
  const handleLogout = async () => {
    setLoading(true);
    try {
      await CRUDAPI(REMOVE_FCM_TOKEN, REMOVE_FCM_TOKEN_METHOD, null, navigate);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      localStorage.clear();
      dispatch(logout());
      navigate("/");
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

  return (
    <div
      ref={profileModalRef}
      className="profile-modal w-52 absolute bg-white right-1 top-14 flex flex-col rounded-lg shadow-lg transition-transform transform duration-300 ease-in-out z-10"
    >
      <ul className="profile-list py-2 w-full">
        <li
          className="profile-item font-Poppins text-sm text-zinc-700 w-full cursor-pointer hover:bg-zinc-200 px-4 py-2 flex items-center gap-2"
          onClick={() => navigate("/profile")}
        >
          <FaUserCircle />
          Profile
        </li>

        <li
          className="profile-item font-Poppins text-sm text-zinc-700 w-full cursor-pointer hover:bg-zinc-200 px-4 py-2 flex items-center gap-2"
          onClick={() => {
            if (!loading) {
              handleLogout();
            }
          }}
        >
          {loading ? (
            <div className="bg-primaryColor rounded-full">
              <LoadingGif additionalStyle={"w-4 h-4"} />
            </div>
          ) : (
            <FaSignOutAlt />
          )}
          Log Out
        </li>
      </ul>
    </div>
  );
};

export default ProfileModal;
