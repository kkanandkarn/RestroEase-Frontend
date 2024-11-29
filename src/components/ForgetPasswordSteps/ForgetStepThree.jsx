import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { FaLessThanEqual } from "react-icons/fa6";
import LoadingGif from "../LoadingGif";
import { useNavigate } from "react-router-dom";

const ForgetStepThree = ({
  formData,
  handleChange,
  errors,
  setErrors,
  confirmPassword,
  setConfirmPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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

  return (
    <div className="mt-4 w-full">
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
        onPaste={(e) => e.preventDefault()}
        autoFocus
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
      <TextField
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        id="confirmPassword"
        autoComplete="current-password"
        value={confirmPassword}
        onChange={(e) => {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "",
          }));
          setConfirmPassword(e.target.value);
        }}
        onPaste={(e) => e.preventDefault()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={toggleShowPasswordVisibility}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default ForgetStepThree;
