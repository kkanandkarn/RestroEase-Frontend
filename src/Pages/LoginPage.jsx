import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
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
import { LOGIN, LOGIN_METHOD } from "../apiCalls/endpoints";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import Logo from "../assets/logo.png";
import loadingImg from "../assets/loading.gif";
import { useGoogleLogin } from "@react-oauth/google";
import { getUserData } from "../config/google-oauth";
import { FaGoogle } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("Authorization");

    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
    googleAuth: false,
  });
  const [errors, setErrors] = React.useState({
    username: "",
    password: "",
  });
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
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

  const apiCall = async (payload) => {
    setLoading(true);
    try {
      const response = await CRUDAPI(LOGIN, LOGIN_METHOD, payload, navigate);
      if (response.status === "SUCCESS") {
        toast.success("Login successfully.");
        const { user, tenant, token } = response.data;
        const userData = {
          username: user.username,
          userId: user.userId,
          role: user.role,
          tenantId: tenant.tenantId,
          tenantName: tenant.tenantName,
          tenantLogo: tenant.tenantLogo,
          token: token,
        };
        dispatch(login(userData));
        localStorage.setItem("Authorization", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setLoading(false);

        if (userData.role === "Waiter") {
          navigate("/waiter-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setLoading(false);
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Internal server error. Please try again lator.");
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      handleOpen();
      const { username, password, googleAuth } = formData;

      try {
        const data = {
          username: username,
          password: password,
          googleAuth: googleAuth,
        };
        await apiCall(data);
      } catch (error) {
        setLoading(false);
        toast.error("Internal server error. Please try again lator.");
        console.log(error);
      }
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const response = await getUserData(codeResponse.code);
      const payload = {
        username: response.email,
        password: "",
        googleAuth: true,
      };
      await apiCall(payload);
    },
    flow: "auth-code",
  });

  const validateForm = () => {
    let valid = true;
    const { username, password } = formData;
    const errorsCopy = { ...errors };

    // Validate email
    if (!username) {
      errorsCopy.username = "Username is required";
      valid = false;
    }

    // Validate password
    if (!password) {
      errorsCopy.password = "Password is required";
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          display: "flex", // Use flexbox to center content
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
          {/* <MdOutlineRestaurant size={100} />  */}
          <img src={Logo} alt="Logo" className="h-52 w-64 mix-blend-multiply" />

          <Typography variant="h4" gutterBottom>
            Welcome To RestroEase
          </Typography>
          <Typography variant="h5" gutterBottom>
            A complete Restro ERP Solution
          </Typography>
        </Box>
      </Grid>

      {/* Right side form */}
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
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
            Log In
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              error={!!errors.username}
              helperText={errors.username}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="email"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "#e91e63", gap: "10px" }}
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6">
                  <img src={loadingImg} alt="Loading" />
                </div>
              ) : (
                <div className="flex gap-2 justify-center items-center">
                  <CiLogin size={20} /> Login
                </div>
              )}
            </Button>
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Grid item>
                <Link
                  to="/forget-password"
                  className="text-sky-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" className="text-sky-600 hover:underline">
                  Don't have an account ?
                </Link>
              </Grid>
            </Grid>
          </Box>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="border-2 border-primaryColor py-1 px-2 flex justify-center items-center gap-2 text-white bg-primaryColor "
              onClick={() => handleGoogleAuth()}
            >
              <FaGoogle /> Log In With Google
            </button>
          </div>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
