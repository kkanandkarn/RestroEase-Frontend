import { Button, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const StepFive = ({ formData, handleChange }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <TextField
        margin="normal"
        fullWidth
        id="contact"
        label="Contact"
        name="contact"
        autoComplete={false}
        value={formData.contact}
        onChange={handleChange}
        autoFocus
      />
      <TextField
        margin="normal"
        fullWidth
        id="address"
        label="Address"
        name="address"
        autoComplete={false}
        value={formData.address}
        onChange={handleChange}
        multiline
        inputProps={{ maxLength: 100 }}
      />
    </div>
  );
};

export default StepFive;
