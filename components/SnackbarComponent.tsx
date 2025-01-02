import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarComponentProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const SnackbarComponent: React.FC<SnackbarComponentProps> = ({ message, type, onClose }) => {
  return (
    <Snackbar
      open={true}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={type} sx={{ fontSize: "16px", padding: "10px 20px" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
