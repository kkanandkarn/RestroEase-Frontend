import React from "react";
import loading from "../assets/loading1.gif";

const LoadingGif = ({ additionalStyle }) => {
  return (
    <div className={` ${additionalStyle || "w-6 h-6"}`}>
      <img src={loading} alt="Loading" />
    </div>
  );
};

export default LoadingGif;
