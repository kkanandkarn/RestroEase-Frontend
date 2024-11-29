import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import LoadingGif from "../LoadingGif";
import toast from "react-hot-toast";
import { CRUDAPI } from "../../apiCalls/crud-api";
import { GENERATE_OTP, GENERATE_OTP_METHOD } from "../../apiCalls/endpoints";
import { useNavigate } from "react-router-dom";

const ForgetStepOne = ({
  formData,
  handleChange,
  errors,
  setErrors,
  setStep,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const { username } = formData;
    // Collect all validation checks in one go
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Collect all validation checks in one go
    const errorsCopy = {
      username: username.trim()
        ? emailRegex.test(username.trim())
          ? ""
          : "Invalid email format."
        : "Username is required.",
    };

    // Filter out empty error messages
    const filteredErrors = Object.fromEntries(
      Object.entries(errorsCopy).filter(([_, value]) => value)
    );

    setErrors(filteredErrors);

    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const data = {
          username: formData.username,
          method: "forgetPassword",
        };

        const response = await CRUDAPI(
          GENERATE_OTP,
          GENERATE_OTP_METHOD,
          data,
          navigate
        );
        if (response.status === "SUCCESS") {
          toast.success("OTP Sent successfully");
          setLoading(false);
          setStep(2);
        } else {
          setLoading(false);
          toast.error(response.message);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        toast.error("An error occured.");
        navigate("/");
      }
    }
  };
  return (
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <TextField
        error={!!errors.username}
        helperText={errors.username}
        margin="normal"
        required
        fullWidth
        id="username"
        label="Enter Your Email As Username"
        name="username"
        autoComplete="email"
        value={formData.username}
        onChange={handleChange}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, bgcolor: "#e91e63", gap: "10px" }}
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? <LoadingGif /> : "Request OTP"}
      </Button>
    </Box>
  );
};

export default ForgetStepOne;
