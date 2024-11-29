import React, { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { hideLoader, showLoader } from "../Loader";
import {
  VIEW_PRODUCT_BY_ID,
  vIEW_PRODUCT_BY_ID_METHOD,
} from "../../apiCalls/endpoints";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CRUDAPI } from "../../apiCalls/crud-api";
import veg from "../../assets/veg.png";
import nonVeg from "../../assets/non-veg.png";

const ViewProductModal = ({ product, onClose }) => {
  return (
    <div
      className="absolute inset-0  w-[100%] max-h-[100vh] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      {/* Header */}
      <div className="w-[60%] max-h-[60vh] bg-white  rounded-lg shadow-lg m-auto flex flex-col">
        <div className="w-full h-14 py-2 bg-primaryColor flex items-center justify-between px-4">
          <div className="text-xl font-Poppins font-bold text-white">
            Product Details
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
              <h1 className="text-base font-poppins font-bold">Product Name</h1>
              <p className="text-sm font-poppins">{product?.productName}</p>
            </div>
            <div className="mt-4">
              <h1 className="text-base font-poppins font-bold">Price</h1>
              <p className="text-sm font-poppins">₹ {product?.price}</p>
            </div>
            <div className="mt-4">
              <h1 className="text-base font-poppins font-bold">Category</h1>
              <p className="text-sm font-poppins">
                {product?.category.category}
              </p>
            </div>
          </div>
          <div className="flex flex-col flex-wrap w-2/4">
            <div>
              <h1 className="text-base font-poppins font-bold">
                Product Description
              </h1>
              <p className="text-sm font-poppins">{product?.productDesc}</p>
            </div>
            <div className="mt-4 gap-2 flex items-center">
              {product?.type === "veg" ? (
                <img src={veg} alt="veg-icon" className="w-4 h-4" />
              ) : (
                <img src={nonVeg} alt="non-veg-icon" className="w-4 h-4" />
              )}
              <p className="text-sm font-poppins">{product?.type}</p>
            </div>
          </div>
          <div className="flex flex-col h-48 w-1/4 items-center">
            <img
              src={product?.image}
              alt="product-img"
              className="h-full w-full object-cover"
            />
            <p className="mt-2 font-poppins text-sm">{product?.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
