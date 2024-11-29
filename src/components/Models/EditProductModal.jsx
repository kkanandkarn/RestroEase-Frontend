import React, { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import LoadingGif from "../LoadingGif";
import { FaSave } from "react-icons/fa";
import {
  Button,
  FormControlLabel,
  Switch,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { hideLoader, showLoader } from "../Loader";
import {
  ADD_PRODUCT,
  ADD_PRODUCT_METHOD,
  DROPDOWN,
  DROPDOWN_METHOD,
  EDIT_PRODUCT,
  EDIT_PRODUCT_METHOD,
  VIEW_PRODUCT_BY_ID,
  vIEW_PRODUCT_BY_ID_METHOD,
} from "../../apiCalls/endpoints";
import { useNavigate } from "react-router-dom";
import SingleSelect from "../Mui/SingleSelect";
import toast from "react-hot-toast";
import { CRUDAPI } from "../../apiCalls/crud-api";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { FaCloudUploadAlt } from "react-icons/fa";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const EditProductModal = ({ product, categories, onClose }) => {
  const navigate = useNavigate();
  const [statusOptions, setStatusOptions] = useState([
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Hold",
      label: "Hold",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = React.useState({
    id: "",
    productName: "",
    productDesc: "",
    price: "",
    categoryId: "",
    image: "",
    type: "non-veg",
    status: "",
  });
  const [errors, setErrors] = React.useState({
    productName: "",
    productDesc: "",
    price: "",
    category: "",
    image: "",
  });
  const [isNonVeg, setIsNonVeg] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [imageMsg, setImageMsg] = useState("No file choosen");
  const [imageError, setImageError] = useState(false);
  const [productImage, setProductImage] = useState();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type.startsWith("image/");
      const fileSize = file.size / 1024 / 1024;

      if (!fileType) {
        setImageError(true);
        setFilePreview(null);
        setImageMsg("Invalid file type");
        return;
      }

      if (fileSize > 5) {
        setImageError(true);
        setFilePreview(null);
        setImageMsg("File size exceeds 5 MB");
        return;
      }

      setImageError(false);
      setImageMsg(file.name);
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setProductImage(file);
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      id: product._id,
      productName: product.productName,
      productDesc: product.productDesc,
      price: product.price,
      categoryId: product.category._id,
      image: product.image,
      type: product.type,
      status: product.status,
    });
    setFilePreview(product.image);
    setProductImage(product.image);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryChange = (newValue) => {
    setFormData((prevFormData) => ({ ...prevFormData, categoryId: newValue }));
    setErrors((prevError) => ({ ...prevError, category: "" }));
  };
  const handleStatusChange = (newValue) => {
    setFormData((prevFormData) => ({ ...prevFormData, status: newValue }));
  };

  const handleSwitchChange = (event) => {
    setIsNonVeg(!isNonVeg);
  };

  const validateForm = () => {
    const { productName, productDesc, price, categoryId } = formData;
    const errorsCopy = {
      productName: productName ? "" : "Product name is required",
      productDesc: productDesc ? "" : "Product description is required",
      price:
        !price || isNaN(price) || Number(price) <= 0
          ? "Please enter a valid price greater than 0"
          : "",
      category: categoryId ? "" : "Category is required",
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(errorsCopy).filter(([_, value]) => value)
    );

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const uploadFileToCloudinary = async (file) => {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);
    formData.append("folder", "products");

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const requestOptions = { method: "POST", body: formData };

    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (response.ok) {
      return data.secure_url;
    } else {
      throw new Error("Cloudinary Upload Failed");
    }
  };

  const updateProduct = async (imageUrl) => {
    const data = {
      id: product._id,
      productName: formData.productName,
      productDesc: formData.productDesc,
      price: formData.price,
      categoryId: formData.categoryId,
      image: imageUrl,
      type: isNonVeg ? "non-veg" : "veg",
      status: formData.status,
    };

    const response = await CRUDAPI(
      EDIT_PRODUCT,
      EDIT_PRODUCT_METHOD,
      data,
      navigate
    );

    if (response.status === "SUCCESS") {
      return response;
    } else {
      throw new Error(response.message);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        let imageUrl = formData.image;

        if (selectedFile) {
          imageUrl = await uploadFileToCloudinary(selectedFile);
        }

        const updateResponse = await updateProduct(imageUrl);
        if (updateResponse.status === "SUCCESS") {
          toast.success("Product updated successfully.");
          onClose(
            true,
            updateResponse.data.products,
            updateResponse.data.totalCount
          );
        }
      } catch (error) {
        toast.error("An error occurred while updating the product.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="absolute inset-0  w-[100%] max-h-[100vh] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      {/* Header */}
      <div className="w-[70%] max-h-[60vh] bg-white border-2 border-zinc-400 rounded-lg shadow-lg m-auto flex flex-col">
        <div className="w-full h-14 py-2 bg-primaryColor flex items-center justify-between px-4">
          <div className="text-xl font-Poppins font-bold text-white">
            Edit Product
          </div>
          <div
            className="text-white cursor-pointer"
            onClick={() => onClose(false, [])}
          >
            <IoMdCloseCircleOutline size={30} />
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-grow flex gap-14 overflow-y-auto p-4">
          <div className="flex flex-col">
            <TextField
              error={!!errors.productName}
              helperText={errors.productName}
              margin="normal"
              required
              fullWidth
              id="productName"
              label="Product Name"
              name="productName"
              autoComplete="off"
              autoFocus
              value={formData.productName}
              onChange={handleChange}
            />
            <TextField
              error={!!errors.price}
              helperText={errors.price}
              margin="normal"
              required
              fullWidth
              id="price"
              label="Price"
              name="price"
              autoComplete="off"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
            <div
              className={`mt-2 ${
                errors.category && "border-2 border-red-500 rounded-lg"
              }`}
            >
              <SingleSelect
                options={categories}
                value={formData.categoryId}
                onChange={handleCategoryChange}
                placeholder={"Choose category"}
              />
            </div>
            {errors.category && (
              <p className="text-[12px] mt-2 ml-4 text-red-500">
                Category is required
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <TextField
              error={!!errors.productDesc}
              helperText={errors.productDesc}
              margin="normal"
              required
              fullWidth
              id="productDesc"
              label="Product Description"
              name="productDesc"
              autoComplete="off"
              value={formData.productDesc}
              onChange={handleChange}
              multiline
              rows={5}
              sx={{ width: "320px" }}
            />
            <SingleSelect
              options={statusOptions}
              value={formData.status}
              onChange={handleStatusChange}
              placeholder={"Choose status"}
            />
            <FormControlLabel
              value={isNonVeg ? "non-veg" : "veg"}
              control={
                <Switch
                  color="primary"
                  checked={!isNonVeg}
                  onChange={handleSwitchChange}
                />
              }
              label={isNonVeg ? "Switch to veg" : "Switch to non-veg"}
              labelPlacement="start"
            />
          </div>
          <div className="flex flex-col items-center h-48 w-40 mt-4">
            <div
              className={`border-2 h-36 w-full flex items-center justify-center ${
                imageError && "border-red-500"
              }`}
            >
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className={`text-sm p-2 text-center ${
                    imageError && "text-red-500 "
                  }`}
                >
                  {imageMsg}
                </span>
              )}
            </div>

            <div>
              <button
                className="mt-2 border-2 bg-primaryColor rounded-full p-2 flex items-center justify-center text-sm text-white font-Poppins"
                onClick={() => document.getElementById("fileInput").click()}
              >
                {filePreview ? "Change File" : "Choose File"}
              </button>

              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>
        </div>

        {/* Footer (Save Button) */}
        <div className="w-full h-14 flex gap-4 justify-end items-center border-t-2 border-t-zinc-400 p-4">
          <button
            className={`${
              loading ? "bg-pink-400" : "bg-primaryColor"
            } py-2 px-4 rounded-full flex items-center justify-center gap-2 text-xl text-white font-Poppins`}
            //   onClick={handleSubmit}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? <LoadingGif /> : <FaSave />}{" "}
            {loading ? "Saving" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
