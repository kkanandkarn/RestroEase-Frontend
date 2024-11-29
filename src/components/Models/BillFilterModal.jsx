import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const BillFilterModal = ({ totalAmountRange, createdAtRange, onClose }) => {
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    setMin(totalAmountRange?.min);
    setMax(totalAmountRange?.max);
    setStart(createdAtRange?.start);
    setEnd(createdAtRange?.end);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(min, max, start, end);
    }, 200);
  };
  const handleSubmit = () => {
    if (!bills || !bills.length) {
    }
    setIsClosing(true);
    setTimeout(() => {
      onClose(min, max, start, end, true);
    }, 200);
  };
  const handleReset = () => {
    setIsClosing(true);
    setMin(null);
    setMax(null);
    setStart(null);
    setEnd(null);
    setTimeout(() => {
      onClose(null, null, null, null, true);
    }, 200);
  };

  return (
    <div
      className={`absolute inset-0 flex justify-end items-center px-4`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        maxWidth: "100wh",
        overflowX: "hidden",
      }}
    >
      {/* Sliding Modal */}
      <div
        className={`${
          isClosing ? "slide-out-right" : "slide-in-right"
        } w-[30%] h-[55vh] bg-white border-2 border-zinc-400 rounded-lg shadow-lg flex flex-col`}
      >
        {/* Header */}
        <div className="w-full h-14 py-2  bg-primaryColor flex items-center justify-between px-4">
          <div className="text-xl font-Poppins font-bold text-white">
            Additional Filters
          </div>
          <div className="text-white cursor-pointer" onClick={handleClose}>
            <IoMdCloseCircleOutline size={30} />
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-grow flex flex-col overflow-y-auto p-4">
          <div className="flex justify-center w-full font-poppins text-md">
            Amount Range
          </div>
          <div className="flex w-full gap-4">
            <TextField
              margin="normal"
              id="min"
              label="Minimum"
              name="min"
              autoComplete="off"
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
            <TextField
              margin="normal"
              id="max"
              label="Maximum"
              name="max"
              autoComplete="off"
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
          <div className="flex justify-center w-full font-poppins text-md mt-2">
            Bill Date Range
          </div>
          <div className="flex w-full gap-4 ">
            <TextField
              type="date"
              margin="normal"
              id="start"
              name="start"
              autoComplete="off"
              fullWidth
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <TextField
              margin="normal"
              id="end"
              name="end"
              autoComplete="off"
              type="date"
              value={end}
              fullWidth
              onChange={(e) => setEnd(e.target.value)}
              inputProps={{
                ...(start && { min: start }), // Apply min only if start is truthy
              }}
            />
          </div>
        </div>

        {/* Footer (Save Button) */}
        <div className="w-full h-14 flex gap-4 justify-end items-center border-t-2 border-t-zinc-400 p-4">
          <button
            className={`${
              !min && !max && !start && !end
                ? "text-pink-400 border-pink-400"
                : "text-primaryColor border-primaryColor"
            } py-1 px-4 rounded-full flex items-center justify-center text-sm  font-poppins border-2 `}
            onClick={handleReset}
            disabled={!min && !max && !start && !end}
          >
            Reset
          </button>
          <button
            className={`${
              !min && !max && !start && !end ? "bg-pink-400" : "bg-primaryColor"
            } py-2 px-4 rounded-full flex items-center justify-center text-sm text-white font-poppins`}
            disabled={!min && !max && !start && !end}
            onClick={handleSubmit}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Keyframes for Slide Animation */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }

        .slide-in-right {
          animation: slideInRight 0.2s ease-out;
        }

        .slide-out-right {
          animation: slideOutRight 0.2s ease-in;
        }
      `}</style>
    </div>
  );
};

export default BillFilterModal;
