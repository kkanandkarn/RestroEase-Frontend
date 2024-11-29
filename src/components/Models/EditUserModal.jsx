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
  ADD_USER,
  ADD_USER_METHOD,
  DROPDOWN,
  DROPDOWN_METHOD,
  UPDATE_USER,
  UPDATE_USER_METHOD,
  VIEW_USER_BY_ID,
  VIEW_USER_BY_ID_METHOD,
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

const EditUserModal = ({ user, roles, onClose }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = React.useState({
    id: "",
    name: "",
    username: "",
    password: "",
    contact: "",
    address: "",
    employeeId: "",
    photo: "",
    role: "",
    status: "",
  });
  const [errors, setErrors] = React.useState({
    name: "",
    username: "",
    password: "",
    role: "",
  });
  const [statusOptions, setStatusOptions] = useState([
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Hold",
      label: "Hold",
    },
    {
      value: "Suspended",
      label: "Suspended",
    },
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [imageMsg, setImageMsg] = useState("No file choosen");
  const [imageError, setImageError] = useState(false);
  const [userImage, setUserImage] = useState();

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
      setUserImage(file);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role._id,
      status: user.status,
      contact: user.contact || "",
      address: user.address || "",
      employeeId: user.employeeId || "",
      photo: user.photo || "",
    }));
  }, []);

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

  const handleRoleChange = (newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: newValue,
    }));

    setErrors((prevError) => ({
      ...prevError,
      role: "",
    }));
  };
  const handleStatusChange = (newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      status: newValue,
    }));
  };

  const validateForm = () => {
    const { name, username, password, role } = formData;
    // Collect all validation checks in one go
    const errorsCopy = {
      name: name ? "" : "Name is required",
      username: username ? "" : "Username is required",
      role: role ? "" : "Role is required",
    };

    // Filter out empty error messages
    const filteredErrors = Object.fromEntries(
      Object.entries(errorsCopy).filter(([_, value]) => value)
    );

    setErrors(filteredErrors);

    return Object.keys(filteredErrors).length === 0;
  };

  const filterEmptyValues = (state) => {
    // Filters out keys with empty string values
    return Object.fromEntries(
      Object.entries(state).filter(([key, value]) => value !== "")
    );
  };

  const updateUser = async (imageUrl) => {
    try {
      const state = {
        id: user._id,
        name: formData.name,
        username: formData.username,
        password: formData.password,
        contact: formData.contact,
        address: formData.address,
        employeeId: formData.employeeId,
        photo: imageUrl,
        role: formData.role,
        status: formData.status,
      };

      const data = filterEmptyValues(state);
      const response = await CRUDAPI(
        UPDATE_USER,
        UPDATE_USER_METHOD,
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

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      let imageUrl = formData.photo;

      if (selectedFile) {
        imageUrl = await uploadFileToCloudinary(selectedFile);
      }
      const editUserResponse = await updateUser(imageUrl);
      setLoading(false);
      if (editUserResponse.status === "SUCCESS") {
        toast.success("User updated successfully.");
        onClose(true, editUserResponse.data.users);
      }
    }
  };

  return (
    <div
      className="absolute inset-0  w-[100%] max-h-[100vh] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      {/* Header */}
      <div className="w-[70%] max-h-[70vh] bg-white border-2 border-zinc-400 rounded-lg shadow-lg m-auto flex flex-col">
        <div className="w-full h-14 py-2 bg-primaryColor flex items-center justify-between px-4">
          <div className="text-xl font-Poppins font-bold text-white">
            Edit User
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
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="off"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              error={!!errors.username}
              helperText={errors.username}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="off"
              type="text"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              autoComplete="off"
              type="text"
              value={formData.password}
              onChange={handleChange}
            />
            <div
              className={`mt-2 ${
                errors.role && "border-2 border-red-500 rounded-lg"
              }`}
            >
              <SingleSelect
                options={roles}
                value={formData.role}
                onChange={handleRoleChange}
                placeholder={"Choose Role"}
              />
            </div>
            {errors.role && (
              <p className="text-[12px] mt-2 ml-4 text-red-500">
                Role is required
              </p>
            )}

            <div className={`mt-4`}>
              <SingleSelect
                options={statusOptions}
                value={formData.status}
                onChange={handleStatusChange}
                placeholder={"Choose Status"}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <TextField
              //   error={!!errors.productDesc}
              //   helperText={errors.productDesc}
              margin="normal"
              required
              fullWidth
              id="contact"
              label="Contact"
              name="contact"
              autoComplete="off"
              value={formData.contact}
              onChange={handleChange}
            />
            <TextField
              //   error={!!errors.productDesc}
              //   helperText={errors.productDesc}
              margin="normal"
              required
              fullWidth
              id="employeeId"
              label="Employee ID"
              name="employeeId"
              autoComplete="off"
              value={formData.employeeId}
              onChange={handleChange}
            />
            <TextField
              //   error={!!errors.productDesc}
              //   helperText={errors.productDesc}
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address"
              name="address"
              autoComplete="off"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={3}
              sx={{ width: "320px" }}
            />
          </div>
          <div className="flex flex-col items-center h-48 w-40 mt-4">
            <div className="border-2 h-36 w-full flex items-center justify-center">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className={`text-sm p-2 text-center`}>{imageMsg}</span>
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

export default EditUserModal;
