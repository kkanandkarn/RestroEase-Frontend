import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import LoadingGif from "../LoadingGif";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StepFour = ({
  formData,
  setFormData,
  handleChange,
  setRestroLogo,
  errors,
  setErrors,
  setStep,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [imageMsg, setImageMsg] = useState("Upload Restro Logo");
  const [imageError, setImageError] = useState(false);
  const [restroImage, setRestroImage] = useState(null);
  const navigate = useNavigate();

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
      //   setFormData((prev) => ({
      //     ...prev,
      //     tenantLogo: file,
      //   }));
      setRestroImage(file);
      setRestroLogo(file);
    }
  };

  const validateForm = () => {
    const { tenantName } = formData;

    const errorsCopy = {
      tenantName: tenantName.trim() ? "" : "Tenant/Restro name is required.",
    };

    // Filter out empty error messages
    const filteredErrors = Object.fromEntries(
      Object.entries(errorsCopy).filter(([_, value]) => value)
    );

    setErrors(filteredErrors);

    if (!restroImage) {
      setImageError(true);
      setImageMsg("Restro logo is required");
    } else {
      setImageError(false);
      setImageMsg("");
    }

    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(5);
    }
  };
  return (
    <div className="w-full">
      <TextField
        error={!!errors.tenantName}
        helperText={errors.tenantName}
        margin="normal"
        autoFocus
        required
        fullWidth
        id="tenantName"
        label="Enter Your Restro Name as Tenant Name"
        name="tenantName"
        autoComplete="off"
        value={formData.tenantName}
        onChange={handleChange}
      />
      <div className="flex gap-4 justify-center items-center mt-1">
        <div
          className={`border-2 h-40 w-40 flex items-center justify-center ${
            imageError && "border-red-500"
          }`}
        >
          {filePreview ? (
            <img
              src={filePreview}
              alt="Preview"
              className="h-full w-full object-contain"
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
      </div>
      <div className="flex justify-center">
        <button
          className="mt-2 border-2 bg-primaryColor rounded-full p-2 flex items-center justify-center text-sm text-white font-Poppins"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("fileInput").click();
          }}
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

      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 2, bgcolor: "#e91e63", gap: "10px" }}
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? <LoadingGif /> : "Next"}
      </Button>

      <p className="text-sm font-poppins font-bold text-primaryColor">Note:</p>
      <ul className="list-disc pl-10 text-sm">
        <li>
          It is recommended to remove the background from the logo before
          uploading.
        </li>
      </ul>
    </div>
  );
};

export default StepFour;
