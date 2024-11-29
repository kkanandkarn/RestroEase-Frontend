import React, { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ViewUserModal = ({ user, onClose }) => {
  return (
    <div
      className="absolute inset-0  w-[100%] max-h-[100vh] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      {/* Header */}
      <div className="w-[60%] max-h-[60vh] bg-white  rounded-lg shadow-lg m-auto flex flex-col">
        <div className="w-full h-14 py-2 bg-primaryColor flex items-center justify-between px-4">
          <div className="text-xl font-Poppins font-bold text-white">
            User Details
          </div>
          <div
            className="text-white cursor-pointer"
            onClick={() => onClose(false, [])}
          >
            <IoMdCloseCircleOutline size={30} />
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-grow flex gap-14 overflow-y-auto p-4 justify-between">
          <div className="flex flex-col w-1/4">
            <div>
              <h1 className="text-base font-poppins font-bold">Name</h1>
              <p className="text-sm font-poppins">{user?.name}</p>
            </div>
            <div className="mt-4">
              <h1 className="text-base font-poppins font-bold">Username</h1>
              <p className="text-sm font-poppins">{user?.username}</p>
            </div>
            <div className="mt-4">
              <h1 className="text-base font-poppins font-bold">Role</h1>
              <p className="text-sm font-poppins">{user?.role?.role}</p>
            </div>
          </div>
          <div className="flex flex-col flex-wrap w-2/4">
            <div>
              <h1 className="text-base font-poppins font-bold">Contact</h1>
              <p className="text-sm font-poppins">{user?.contact}</p>
            </div>
            <div className="mt-4">
              <h1 className="text-base font-poppins font-bold">Employee ID</h1>
              <p className="text-sm font-poppins">{user?.employeeId}</p>
            </div>
            <div className="mt-4">
              <h1 className="text-base font-poppins font-bold">Address</h1>
              <p className="text-sm font-poppins">{user?.address}</p>
            </div>
          </div>
          <div className="flex flex-col h-48 w-1/4 items-center">
            <div className="border-2 h-36 w-full flex items-center justify-center">
              {user?.photo ? (
                <img
                  src={user?.photo}
                  alt="user-img"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className={`text-sm p-2 text-center`}>
                  No file uploaded
                </span>
              )}
            </div>

            <p className="mt-2 font-poppins text-sm">{user?.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
