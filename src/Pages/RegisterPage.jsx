import * as React from "react";
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

function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("Authorization");

    if (token) {
      navigate("/dashboard");
    }
  }, []);

  // Handle redirect result

  const [formData, setFormData] = useState({
    tenantName: "",
    tenantLogo: null,
    name: "",
    username: "",
    password: "",
    contact: "",
    address: "",
    photo: "",
    googleAuth: false,
  });
  const [errors, setErrors] = useState({
    tenantName: "",
    tenantLogo: "",
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [restroLogo, setRestroLogo] = useState(null);

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const response = await getUserData(codeResponse.code);
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: response.name,
        username: response.email,
        photo: response.picture,
        googleAuth: true,
      }));
      setStep(4);
      toast.success("Authenticated successfully");
    },
    flow: "auth-code",
  });

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

  const steps = [
    "User Details",
    "Verify OTP",
    "Password Configuration",
    "Tenant/Restro Details",
    "Contact Details",
  ];

  const handleSubmit = async (fileUrl, publicId) => {
    try {
      const data = {
        tenantName: formData.tenantName,
        tenantLogo: fileUrl,
        name: formData.name,
        username: formData.username,
        password: formData.password,
        contact: formData.contact.trim() === "" ? null : formData.contact,
        address: formData.address.trim() === "" ? null : formData.address,
        photo: formData.photo,
        googleAuth: formData.googleAuth,
      };
      const response = await CRUDAPI(REGISTER, REGISTER_METHOD, data, navigate);
      if (response.statusCode === 501) {
        setStep(1);
        toast.error(response.message);
      } else if (response.statusCode === 200) {
        return;
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occured.");
      setStep(1);
    }
  };

  const uploadImage = async (e) => {
    e.preventDefault();

    setLoading(true);
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const formData = new FormData();
    formData.append("file", restroLogo);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);
    formData.append("folder", "tenants");

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
          tenantLogo: data.secure_url,
        }));
        await handleSubmit(data.secure_url, data.public_id);
        toast.success("Register successfull");
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 2000);
      } else {
        console.error("Cloudinary Upload Failed:", data);
        setLoading(false);
        toast.error("An error occured.");
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occured.");
      setStep(1);
      console.error("Cloudinary Upload Error:", error);
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
            Register
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
            <StepOne
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              setErrors={setErrors}
              setStep={setStep}
            />
          )}
          {step === 2 && <StepTwo formData={formData} setStep={setStep} />}

          {step === 3 && (
            <StepThree
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              errors={errors}
              setErrors={setErrors}
              setStep={setStep}
            />
          )}

          {step === 4 && (
            <StepFour
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              setRestroLogo={setRestroLogo}
              errors={errors}
              setErrors={setErrors}
              setStep={setStep}
            />
          )}
          {step === 5 && (
            <StepFive formData={formData} handleChange={handleChange} />
          )}

          {step === 1 && (
            <>
              <Grid item>
                <Link to="/" className="text-sky-600 hover:underline">
                  Already have an account ?
                </Link>
              </Grid>

              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  className="border-2 border-primaryColor py-1 px-2 flex justify-center items-center gap-2 text-white bg-primaryColor "
                  onClick={() => handleGoogleAuth()}
                >
                  <FaGoogle /> Sign Up With Google
                </button>
              </div>
            </>
          )}
          {step === 5 && (
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "#e91e63", gap: "10px" }}
              onClick={uploadImage}
              disabled={loading}
            >
              {loading ? "SAVING" : "SAVE"}
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default Register;
