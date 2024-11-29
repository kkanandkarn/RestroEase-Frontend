import React, { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import LoadingGif from "../LoadingGif";
import { FaSave } from "react-icons/fa";
import {
  Button,
  FormControlLabel,
  Switch,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { hideLoader, showLoader } from "../Loader";
import {
  ADD_CATEGORY,
  ADD_CATEGORY_METHOD,
  ADD_PRODUCT,
  ADD_PRODUCT_METHOD,
  ADD_TABLE,
  ADD_TABLE_METHOD,
  DROPDOWN,
  DROPDOWN_METHOD,
} from "../../apiCalls/endpoints";
import { useNavigate } from "react-router-dom";
import SingleSelect from "../Mui/SingleSelect";
import toast from "react-hot-toast";
import { CRUDAPI } from "../../apiCalls/crud-api";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddTableModal = ({ tables, onClose }) => {
  const navigate = useNavigate();
  const [table, setTable] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableError, setTableError] = useState("");

  const handleSubmit = async () => {
    if (!table.trim()) {
      setTableError("Table number is required");
      return;
    }
    const isConflict = tables.some((tb) => tb.tableNumber === table);
    if (isConflict) {
      setTableError("Table number already exists");
      return;
    }
    setLoading(true);
    try {
      const data = {
        tableNumber: table,
      };
      const response = await CRUDAPI(
        ADD_TABLE,
        ADD_TABLE_METHOD,
        data,
        navigate
      );

      if (response.status === "SUCCESS") {
        setLoading(false);
        toast.success("Table added successfully.");
        onClose(true, response.data.tables);
      } else {
        setLoading(false);
        toast.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Internal server error. Please try again lator.");
      console.log(error);
    }
  };

  return (
    <div
      className="absolute inset-0  w-[100%] max-h-[100vh] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      {/* Header */}
      <div className="w-[30%] max-h-[60vh] bg-white border-2 border-zinc-400 rounded-lg shadow-lg m-auto flex flex-col">
        <div className="w-full h-14 py-2 bg-primaryColor flex items-center justify-between px-4">
          <div className="text-xl font-Poppins font-bold text-white">
            Add Table
          </div>
          <div
            className="text-white cursor-pointer"
            onClick={() => onClose(false, [])}
          >
            <IoMdCloseCircleOutline size={30} />
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-grow flex gap-14 overflow-y-auto p-4">
          <TextField
            error={!!tableError}
            helperText={tableError}
            margin="normal"
            required
            fullWidth
            id="table"
            label="Table Number"
            name="table"
            autoComplete="off"
            autoFocus
            value={table}
            onChange={(e) => {
              setTableError("");
              setTable(e.target.value);
            }}
          />
        </div>

        {/* Footer (Save Button) */}
        <div className="w-full h-14 flex gap-4 justify-end items-center border-t-2 border-t-zinc-400 p-4">
          <button
            className={`${
              loading ? "bg-pink-400" : "bg-primaryColor"
            } py-2 px-4 rounded-full flex items-center justify-center gap-2 text-xl text-white font-Poppins`}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? <LoadingGif /> : <FaSave />}{" "}
            {loading ? "Saving" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTableModal;
