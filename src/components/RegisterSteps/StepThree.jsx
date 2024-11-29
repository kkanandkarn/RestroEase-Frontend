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

const StepThree = ({ formData, handleChange, errors, setErrors, setStep }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(4);
    }
  };

  return (
    <div className="mt-4">
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

      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, bgcolor: "#e91e63", gap: "10px" }}
        onClick={handleSubmit}
      >
        {loading ? <LoadingGif /> : "Next"}
      </Button>
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
  );
};

export default StepThree;
