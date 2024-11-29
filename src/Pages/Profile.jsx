import React, { useEffect, useState } from "react";
import Layout from "../Layout/index.Jsx";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaSave } from "react-icons/fa";

import toast from "react-hot-toast";
import { CRUDAPI } from "../apiCalls/crud-api";
import {
  UPDATE_PROFILE,
  UPDATE_PROFILE_METHOD,
  VIEW_PROFILE,
  VIEW_PROFILE_METHOD,
} from "../apiCalls/endpoints";
import { TextField } from "@mui/material";
import LoadingGif from "../components/LoadingGif";

const Profile = () => {
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState({
    username: "",
    role: "",
    employeeId: "",
    name: "",
    contact: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [imageMsg, setImageMsg] = useState("No file choosen");
  const [imageError, setImageError] = useState(false);
  const [profileImage, setProfileImage] = useState();

  const viewProfile = async () => {
    setLoading(true);
    try {
      const response = await CRUDAPI(
        VIEW_PROFILE,
        VIEW_PROFILE_METHOD,
        null,
        navigate
      );
      if (response.status === "SUCCESS") {
        setLoading(false);
        setUserData({
          username: response.data.username || "",
          role: response.data.role || "",
          employeeId: response.data.employeeId || "",
          name: response.data.name || "",
          contact: response.data.contact || "",
          address: response.data.address || "",
          photo: response.data.photo || "",
        });
        if (response.data.photo) {
          setFilePreview(response.data.photo);
          setProfileImage(response.data.photo);
        }
      } else {
        setLoading(false);
        toast.error(response.message);
        navigate("/dashboard");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("An error occureed");
      navigate("/dashboard");
    }
  };

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
      setProfileImage(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProfile = async (imageUrl) => {
    try {
      const payload = {
        name: userData?.name?.trim(),
        contact: userData?.contact?.trim(),
        address: userData?.address?.trim(),
        photo: imageUrl,
      };
      const response = await CRUDAPI(
        UPDATE_PROFILE,
        UPDATE_PROFILE_METHOD,
        payload,
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
    formData.append("folder", "users");

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
    if (!imageError) {
      setUpdateLoading(true);
      try {
        let imageUrl = userData.photo;

        if (selectedFile) {
          imageUrl = await uploadFileToCloudinary(selectedFile);
        }

        const updateResponse = await updateProfile(imageUrl);
        if (updateResponse.status === "SUCCESS") {
          toast.success("Profile updated successfully.");
          setUserData(updateResponse.data.user);
          setUpdateLoading(false);
        }
      } catch (error) {
        toast.error("An error occurred while updating the product.");
        setUpdateLoading(false);
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const Authorization = localStorage.getItem("Authorization");
    if (!Authorization) {
      navigate("/");
    }
    viewProfile();
  }, []);

  return (
    <Layout title="Profile">
      <div className="flex justify-center mt-4">
        <div className="">
          {loading ? (
            <div className="bg-slate-400 h-24 w-24 rounded-full animate-pulse"></div>
          ) : (
            <div className="bg-slate-400 h-24 w-24 rounded-full flex justify-center items-center object-cover">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="user image"
                  srcset=""
                  className="w-full h-full rounded-full"
                />
              ) : (
                <div>
                  <FaCamera size={30} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        {loading ? (
          <div className="mt-4 w-24 h-10 rounded-full animate-pulse bg-slate-400"></div>
        ) : (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </div>

      {imageError && (
        <p className="text-center text-red-600 text-sm mt-1">{imageMsg}</p>
      )}

      {loading ? (
        <React.Fragment>
          <div className="bg-slate-400 w-32 h-6 ml-10 rounded-lg animate-pulse"></div>
          <div className="flex px-10 gap-4 animate-pulse mt-6">
            <div className="bg-slate-400 w-1/3 h-14 rounded-lg"></div>
            <div className="bg-slate-400 w-1/3 h-14 rounded-lg"></div>
            <div className="bg-slate-400 w-1/3 h-14 rounded-lg"></div>
          </div>
          <div className="flex px-10 gap-4 animate-pulse mt-6">
            <div className="bg-slate-400 w-1/3 h-14 rounded-lg"></div>
            <div className="bg-slate-400 w-1/3 h-14 rounded-lg"></div>
            <div className="bg-slate-400 w-1/3 h-14 rounded-lg"></div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="px-10 mt-4 font-bold font-poppins text-primaryColor text-lg">
            <h1>Profile Details</h1>
          </div>

          <div className="flex w-full gap-4 justify-center px-10">
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="off"
              value={userData?.username}
              placeholder="Enter username"
              inputProps={{ maxLength: 100 }}
              disabled
            />
            <TextField
              margin="normal"
              fullWidth
              id="role"
              label="Role"
              name="role"
              autoComplete="off"
              value={userData?.role?.role}
              placeholder="Enter username"
              inputProps={{ maxLength: 100 }}
              disabled
            />
            <TextField
              margin="normal"
              fullWidth
              id="employeeId"
              label="Employee ID"
              name="employeeId"
              autoComplete="off"
              value={userData?.employeeId}
              onChange={handleChange}
              placeholder="Enter employee id"
              inputProps={{ maxLength: 100 }}
              disabled
            />
          </div>
          <div className="flex w-full gap-4 justify-center px-10">
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="off"
              value={userData?.name}
              onChange={handleChange}
              placeholder="Enter name"
              inputProps={{ maxLength: 100 }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="contact"
              label="Contact"
              name="contact"
              autoComplete="off"
              value={userData?.contact}
              onChange={handleChange}
              placeholder="Enter contact"
              inputProps={{ maxLength: 10 }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="address"
              label="Address"
              name="address"
              autoComplete="off"
              value={userData?.address}
              onChange={handleChange}
              placeholder="Enter address"
              inputProps={{ maxLength: 100 }}
            />
          </div>
        </React.Fragment>
      )}
      <div className="flex justify-center">
        {loading ? (
          <div className="mt-4 w-24 h-8 rounded-full animate-pulse bg-slate-400"></div>
        ) : (
          <button
            className={`mt-4 flex items-center justify-center gap-1 text-primaryColor text-sm border-2 border-primaryColor font-bold ${
              !updateLoading && "hover:bg-primaryColor hover:text-white"
            }  font-poppins py-2 px-4 rounded-full duration-500 w-26 h-8`}
            onClick={handleSubmit}
            disabled={updateLoading}
          >
            {updateLoading ? <LoadingGif /> : <FaSave />}
            {updateLoading ? "Saving" : "Save"}
          </button>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
