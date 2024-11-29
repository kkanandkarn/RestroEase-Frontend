import React, { useEffect, useState } from "react";
import OTPInput from "../Mui/OTPInput";
import { Button } from "@mui/material";
import LoadingGif from "../LoadingGif";
import { VERIFY_OTP, VERIFY_OTP_METHOD } from "../../apiCalls/endpoints";
import { useNavigate } from "react-router-dom";
import { CRUDAPI } from "../../apiCalls/crud-api";
import toast from "react-hot-toast";

const StepTwo = ({ formData, setStep }) => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        username: formData.username,
        otp: otp,
      };

      const response = await CRUDAPI(
        VERIFY_OTP,
        VERIFY_OTP_METHOD,
        data,
        navigate
      );
      if (response.statusCode === 429) {
        toast.error(response.message);
        setStep(1);
      } else if (response.statusCode === 200) {
        toast.success("OTP Verified successfully");
        setLoading(false);
        setStep(3);
      } else {
        setLoading(false);
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("An error occured.");
      navigate("/");
    }
  };

  useEffect(() => {
    if (otp.length !== 4) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [otp]);

  return (
    <div className="mt-8">
      <OTPInput otp={otp} setOtp={setOtp} />
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 4, mb: 2, bgcolor: "#e91e63", gap: "10px" }}
        onClick={handleSubmit}
        disabled={loading || isDisable}
      >
        {loading ? <LoadingGif /> : "Verify OTP"}
      </Button>
    </div>
  );
};

export default StepTwo;
