import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/index.Jsx";
import ErrorIcon from "../assets/Error-Icon.jpg";

const NotFound = () => {
  const navigate = useNavigate();
  // useEffect(() => {
  //   navigate("/dashboard");
  // }, []);
  return (
    <Layout title="Not Found">
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col justify-center items-center">
          <img src={ErrorIcon} alt="Not Found" className="w-48 h-48" />
          <p className="font-poppins font-bold text-2xl text-primaryColor text-center mt-4">
            Page not found
          </p>
          <button
            className="border-2 border-primaryColor text-primaryColor px-4 py-1 mt-4 rounded-lg hover:bg-primaryColor hover:text-white ease-in-out duration-500"
            onClick={() => navigate("/dashboard")}
          >
            Home
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
