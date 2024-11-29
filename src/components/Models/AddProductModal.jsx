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

const AddProductModal = ({ categories, onClose }) => {
  const navigate = useNavigate();
  // const [categories, setCategories] = useState();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = React.useState({
    productName: "",
    productDesc: "",
    price: "",
    categoryId: "",
    image: "",
    type: "non-veg",
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

  // Handle file selection
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
      setImageMsg("");
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setProductImage(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCategoryChange = (newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      categoryId: newValue,
    }));

    setErrors((prevError) => ({
      ...prevError,
      category: "",
    }));
  };

  const handleSwitchChange = (event) => {
    setIsNonVeg(event.target.checked);
    setFormData((prev) => ({
      ...prev,
      type: isNonVeg ? "non-veg" : "veg",
    }));
  };

  const validateForm = () => {
    const { productName, productDesc, price, categoryId, image } = formData;
    // Collect all validation checks in one go
    const errorsCopy = {
      productName: productName ? "" : "Product name is required",
      productDesc: productDesc ? "" : "Product description is required",
      price:
        !price || isNaN(price) || Number(price) <= 0
          ? "Please enter a valid price greater than 0"
          : "",
      category: categoryId ? "" : "Category is required",
      image: productImage ? "" : "Product image is required",
    };

    // Filter out empty error messages
    const filteredErrors = Object.fromEntries(
      Object.entries(errorsCopy).filter(([_, value]) => value)
    );

    setErrors(filteredErrors);

    if (!productImage) {
      setImageError(true);
      setImageMsg("Product image is required");
    } else {
      setImageError(false);
      setImageMsg("");
    }

    return Object.keys(filteredErrors).length === 0;
  };

  const addProduct = async (imageUrl) => {
    try {
      const data = {
        productName: formData.productName,
        productDesc: formData.productDesc,
        price: formData.price,
        categoryId: formData.categoryId,
        image: imageUrl,
        type: formData.type,
      };
      const response = await CRUDAPI(
        ADD_PRODUCT,
        ADD_PRODUCT_METHOD,
        data,
        navigate
      );
      if (response.status === "SUCCESS") {
        return response;
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Internal server error. Please try again lator.");
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const formData = new FormData();
      formData.append("file", productImage);
      formData.append("upload_preset", uploadPreset);
      formData.append("cloud_name", cloudName);
      formData.append("folder", "products");

      try {
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const requestOptions = {
          method: "POST",
          body: formData,
        };

        const response = await fetch(url, requestOptions);
        const data = await response.json();

        if (response.ok) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            image: data.secure_url,
          }));

          const addProductResponse = await addProduct(data.secure_url);
          setLoading(false);
          if (addProductResponse.status === "SUCCESS") {
            toast.success("Product added successfully.");
            onClose(
              true,
              addProductResponse.data.products,
              addProductResponse.data.totalCount
            );
          }
        } else {
          console.error("Cloudinary Upload Failed:", data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Cloudinary Upload Error:", error);
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
            Add Product
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
              placeholder="max length 100 characters is allowed"
              inputProps={{ maxLength: 100 }}
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
                placeholder={"Choose Category"}
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
              sx={{ width: "300px" }}
              placeholder="max length 150 characters is allowed"
              inputProps={{ maxLength: 150 }}
            />
            <FormControlLabel
              value="non-veg"
              control={
                <Switch
                  color="primary"
                  checked={isNonVeg}
                  onChange={handleSwitchChange}
                />
              }
              label={
                formData.type === "non-veg"
                  ? "Switch to veg"
                  : "Switch to non-veg"
              }
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

export default AddProductModal;
