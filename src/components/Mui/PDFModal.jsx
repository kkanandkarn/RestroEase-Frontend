import React from "react";
import Modal from "@mui/material/Modal";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon

const PDFModal = ({ open, onClose, pdfUrl }) => {
  return (
    <Modal open={open} onClose={onClose} sx={{ backdropFilter: "blur(5px)" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          bgcolor: "transparent",
          boxShadow: "none",
          borderRadius: 1,
          outline: "none",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "80%",
            height: "80%",
            overflow: "hidden",
            bgcolor: "white",
            borderRadius: 1,
          }}
        >
          {/* Close Icon */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              zIndex: 1000,
              bgcolor: "white",
              "&:hover": {
                bgcolor: "grey.300",
              },
              padding: 0,
            }}
          >
            <CloseIcon />
          </IconButton>

          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            title="PDF Viewer"
            style={{ border: "none" }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default PDFModal;
