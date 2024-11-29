import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import LoginImage from "../assets/loginimage.jpg";
import { MdOutlineRestaurant } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { hideLoader, showLoader } from "../components/Loader";
import LoadingGif from "../components/LoadingGif";
import { CRUDAPI } from "../apiCalls/crud-api";
import {
  LOGIN,
  LOGIN_METHOD,
  REGISTER,
  REGISTER_METHOD,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_METHOD,
} from "../apiCalls/endpoints";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import Logo from "../assets/logo.png";
import StepOne from "../components/RegisterSteps/StepOne";
import StepTwo from "../components/RegisterSteps/StepTwo";
import StepThree from "../components/RegisterSteps/StepThree";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepFour from "../components/RegisterSteps/StepFour";
import StepFive from "../components/RegisterSteps/StepFive";
import { useEffect } from "react";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { getUserData } from "../config/google-oauth";
import ForgetStepOne from "../components/ForgetPasswordSteps/ForgetStepOne";
import ForgetStepTwo from "../components/ForgetPasswordSteps/ForgetStepTwo";
import ForgetStepThree from "../components/ForgetPasswordSteps/ForgetStepThree";

const ForgetPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("Authorization");

    if (token) {
      navigate("/dashboard");
    }
  }, []);

  // Handle redirect result

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [restroLogo, setRestroLogo] = useState(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const steps = ["Username", "Verify OTP", "Update Password"];

  const validateForm = () => {
    const { password } = formData;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const errorsCopy = {
      password: password.trim()
        ? passwordRegex.test(password.trim())
          ? ""
          : "Invalid Password Format."
        : "Password is required.",
      confirmPassword: confirmPassword.trim()
        ? ""
        : "Confirm Password is required.",
    };

    console.log("password: ", password);

    console.log("confirmPassword: ", confirmPassword);

    if (confirmPassword.trim() !== password.trim()) {
      errorsCopy.confirmPassword = "Confirm password does not match";
    }

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
          password: formData.password,
        };
        const response = await CRUDAPI(
          UPDATE_PASSWORD,
          UPDATE_PASSWORD_METHOD,
          data,
          navigate
        );
        if (response.statusCode === 200) {
          toast.success("Password updated successfully.");
          setTimeout(() => {
            setLoading(false);
            navigate("/");
          }, 2000);
        } else {
          setLoading(false);
          toast.error(response.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occured.");
        setLoading(false);
        setStep(1);
      }
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh", width: "100vw" }}>
      <Toaster position="top-center" reverseOrder={false} />
      <CssBaseline />

      {/* Left side image with text overlay */}
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          backgroundImage: `url(${LoginImage})`,
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          position: "relative", // Positioning for text overlay
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column", // Use flexbox to center content
            justifyContent: "center", // Center horizontally
            alignItems: "center",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
          }}
        >
          <img src={Logo} alt="Logo" className="h-52 w-64 mix-blend-multiply" />

          <Typography variant="h4" gutterBottom>
            Welcome To RestroEase
          </Typography>
          <Typography variant="h5" gutterBottom>
            A complete Restro ERP Solution
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 4,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#e91e63" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Update Password
          </Typography>

          <Box sx={{ width: "100%", my: 2 }}>
            <Stepper activeStep={step - 1} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {step === 1 && (
            <ForgetStepOne
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              setErrors={setErrors}
              setStep={setStep}
            />
          )}
          {step === 2 && (
            <ForgetStepTwo formData={formData} setStep={setStep} />
          )}

          {step === 3 && (
            <ForgetStepThree
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              errors={errors}
              setErrors={setErrors}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
            />
          )}

          {step === 3 && (
            <>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#e91e63", gap: "10px" }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "SAVING" : "SAVE"}
              </Button>
            </>
          )}

          {step === 3 && (
            <div className="w-full">
              <p className="text-sm font-poppins font-bold text-primaryColor">
                Password must be
              </p>
              <ul className="list-disc pl-10 text-sm">
                <li>At least 8 characters long</li>
                <li>Contains at least one uppercase letter.</li>
                <li>Contains at least one lowercase letter.</li>
                <li>Contains at least one number.</li>
                <li>Contains at least one special character.</li>
              </ul>
            </div>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgetPassword;
